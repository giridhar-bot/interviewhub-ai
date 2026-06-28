import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import {
  getDecks,
  getDeck,
  createDeck,
  updateDeck,
  getReviewQueue,
  reviewCard,
  initializeSRS,
  recordRevisionSession,
  getRevisionHistory,
} from "@/services/flashcard.service";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  topicId: z.string().uuid(),
  cards: z.array(z.object({
    front: z.string().min(1),
    back: z.string().min(1),
    order: z.number().int(),
  })).min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

const reviewSchema = z.object({
  deckId: z.string().uuid(),
  cardId: z.string().uuid(),
  quality: z.number().int().min(0).max(5),
});

const sessionSchema = z.object({
  topicIds: z.array(z.string().uuid()),
  cardsReviewed: z.number().int(),
  correctCount: z.number().int(),
  duration: z.number().int().optional(),
});

// GET /api/flashcards
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const action = searchParams.get("action");

  if (slug) {
    const deck = await getDeck(slug);
    if (!deck) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(deck);
  }

  if (action === "review-queue") {
    const user = await requireAuth();
    const deckId = searchParams.get("deckId");
    if (!deckId) return NextResponse.json({ error: "Missing deckId" }, { status: 400 });
    const queue = await getReviewQueue(user.id, deckId);
    return NextResponse.json(queue);
  }

  if (action === "history") {
    const user = await requireAuth();
    const history = await getRevisionHistory(user.id);
    return NextResponse.json(history);
  }

  const decks = await getDecks({
    topicId: searchParams.get("topicId") || undefined,
  });
  return NextResponse.json(decks);
}

// POST /api/flashcards
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  // Review a card (spaced repetition)
  if (body.action === "review") {
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const state = await reviewCard(user.id, parsed.data.deckId, parsed.data.cardId, parsed.data.quality);
    return NextResponse.json(state);
  }

  // Initialize SRS
  if (body.action === "init-srs") {
    const deckId = body.deckId;
    if (!deckId) return NextResponse.json({ error: "Missing deckId" }, { status: 400 });
    const states = await initializeSRS(user.id, deckId);
    return NextResponse.json(states);
  }

  // Record revision session
  if (body.action === "session") {
    const parsed = sessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const session = await recordRevisionSession(
      user.id,
      parsed.data.topicIds,
      parsed.data.cardsReviewed,
      parsed.data.correctCount,
      parsed.data.duration
    );
    return NextResponse.json(session);
  }

  // Create deck (admin only)
  if (!["ADMIN", "SUPER_ADMIN", "AUTHOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const deck = await createDeck(parsed.data);
  return NextResponse.json(deck, { status: 201 });
}

// PUT /api/flashcards — Update deck
export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  if (!["ADMIN", "SUPER_ADMIN", "AUTHOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const deck = await updateDeck(id, data);
  return NextResponse.json(deck);
}
