// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Flashcard Service (Spaced Repetition)
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getCache, setCache, deleteCache } from "@/lib/redis";
import { redis } from "@/lib/redis";

// ─── List Decks ─────────────────────────────

export async function getDecks(options?: {
  topicId?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  return prisma.flashcardDeck.findMany({
    where: {
      status: options?.status || "PUBLISHED",
      ...(options?.topicId && { topicId: options.topicId }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      _count: { select: { flashcards: true } },
    },
  });
}

// ─── Get Deck with Cards ────────────────────

export async function getDeck(slug: string) {
  const cacheKey = `deck:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchDeck>>>(cacheKey);
  if (cached) return cached;

  const deck = await fetchDeck(slug);
  if (deck) await setCache(cacheKey, deck, 3600);
  return deck;
}

async function fetchDeck(slug: string) {
  return prisma.flashcardDeck.findUnique({
    where: { slug },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      flashcards: { orderBy: { order: "asc" } },
    },
  });
}

// ─── Create Deck ────────────────────────────

export async function createDeck(data: {
  title: string;
  slug: string;
  description?: string;
  topicId: string;
  cards: { front: string; back: string; order: number }[];
  status?: "DRAFT" | "PUBLISHED";
}) {
  return prisma.flashcardDeck.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      topicId: data.topicId,
      cardCount: data.cards.length,
      status: data.status || "DRAFT",
      flashcards: {
        create: data.cards.map((c) => ({
          front: c.front,
          back: c.back,
          order: c.order,
        })),
      },
    },
    include: { flashcards: true },
  });
}

// ─── Update Deck ────────────────────────────

export async function updateDeck(
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    cards?: { id?: string; front: string; back: string; order: number }[];
  }
) {
  const deck = await prisma.flashcardDeck.findUnique({ where: { id } });
  if (!deck) throw new Error("Deck not found");

  if (data.cards) {
    await prisma.flashcard.deleteMany({ where: { deckId: id } });
    await prisma.flashcard.createMany({
      data: data.cards.map((c) => ({
        deckId: id,
        front: c.front,
        back: c.back,
        order: c.order,
      })),
    });
  }

  const updated = await prisma.flashcardDeck.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.cards && { cardCount: data.cards.length }),
    },
    include: { flashcards: { orderBy: { order: "asc" } } },
  });

  await deleteCache(`deck:${deck.slug}`);
  return updated;
}

// ─── Spaced Repetition (Redis-based user state) ─

const SRS_KEY = (userId: string, deckId: string) => `srs:${userId}:${deckId}`;

interface CardState {
  cardId: string;
  ease: number; // 2.5 default
  interval: number; // days
  nextReview: string; // ISO date
  repetitions: number;
}

export async function getReviewQueue(userId: string, deckId: string) {
  const key = SRS_KEY(userId, deckId);
  const data = await redis.get(key);
  if (!data) return [];

  const states: CardState[] = JSON.parse(data);
  const now = new Date();
  return states.filter((s) => new Date(s.nextReview) <= now);
}

export async function reviewCard(
  userId: string,
  deckId: string,
  cardId: string,
  quality: number // 0-5 scale: 0=again, 3=good, 5=easy
) {
  const key = SRS_KEY(userId, deckId);
  const data = await redis.get(key);
  const states: CardState[] = data ? JSON.parse(data) : [];

  let state = states.find((s) => s.cardId === cardId);
  if (!state) {
    state = {
      cardId,
      ease: 2.5,
      interval: 1,
      nextReview: new Date().toISOString(),
      repetitions: 0,
    };
    states.push(state);
  }

  // SM-2 Algorithm
  if (quality < 3) {
    state.repetitions = 0;
    state.interval = 1;
  } else {
    state.repetitions += 1;
    if (state.repetitions === 1) {
      state.interval = 1;
    } else if (state.repetitions === 2) {
      state.interval = 6;
    } else {
      state.interval = Math.round(state.interval * state.ease);
    }
  }

  state.ease = Math.max(1.3, state.ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  const next = new Date();
  next.setDate(next.getDate() + state.interval);
  state.nextReview = next.toISOString();

  // Update state in array
  const idx = states.findIndex((s) => s.cardId === cardId);
  if (idx >= 0) states[idx] = state;

  await redis.set(key, JSON.stringify(states), "EX", 86400 * 90); // 90 days
  return state;
}

// ─── Initialize SRS for deck ────────────────

export async function initializeSRS(userId: string, deckId: string) {
  const deck = await prisma.flashcardDeck.findUnique({
    where: { id: deckId },
    include: { flashcards: true },
  });
  if (!deck) throw new Error("Deck not found");

  const key = SRS_KEY(userId, deckId);
  const existing = await redis.get(key);
  if (existing) return JSON.parse(existing) as CardState[];

  const states: CardState[] = deck.flashcards.map((f) => ({
    cardId: f.id,
    ease: 2.5,
    interval: 1,
    nextReview: new Date().toISOString(),
    repetitions: 0,
  }));

  await redis.set(key, JSON.stringify(states), "EX", 86400 * 90);
  return states;
}

// ─── Delete Deck ────────────────────────────

export async function deleteDeck(id: string) {
  const deck = await prisma.flashcardDeck.findUnique({ where: { id } });
  if (!deck) throw new Error("Deck not found");

  await prisma.flashcardDeck.delete({ where: { id } });
  await deleteCache(`deck:${deck.slug}`);
  return deck;
}

// ─── Record Revision Session ────────────────

export async function recordRevisionSession(
  userId: string,
  topicIds: string[],
  cardsReviewed: number,
  correctCount: number,
  duration?: number
) {
  return prisma.revisionSession.create({
    data: { userId, topicIds, cardsReviewed, correctCount, duration },
  });
}

// ─── Get Revision History ───────────────────

export async function getRevisionHistory(userId: string, limit = 20) {
  return prisma.revisionSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
