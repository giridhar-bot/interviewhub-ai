// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Flashcard Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const flashcardRepository = {
  async findDecksByTopic(topicId: string) {
    return prisma.flashcardDeck.findMany({
      where: { topicId },
      include: { _count: { select: { flashcards: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  async findDeckWithCards(id: string) {
    return prisma.flashcardDeck.findUnique({
      where: { id },
      include: { flashcards: { orderBy: { order: "asc" } } },
    });
  },

  async updateProgress(data: {
    userId: string;
    flashcardId: string;
    confidence: number;
    nextReviewAt: Date;
  }) {
    return prisma.flashcardProgress.upsert({
      where: {
        userId_flashcardId: {
          userId: data.userId,
          flashcardId: data.flashcardId,
        },
      },
      create: { userId: data.userId, flashcardId: data.flashcardId, confidence: data.confidence, nextReviewAt: data.nextReviewAt },
      update: {
        confidence: data.confidence,
        nextReviewAt: data.nextReviewAt,
        reviewCount: { increment: 1 },
      },
    });
  },
};
