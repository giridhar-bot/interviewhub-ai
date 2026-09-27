import { prisma } from "@/lib/prisma";
import type { QuestionType } from "@/generated/prisma/client";

export const questionRepository = {
  async findPublishedByType(type: QuestionType, limit = 50) {
    const where = { type, status: "PUBLISHED" as const, deletedAt: null };
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: [{ views: "desc" }, { createdAt: "desc" }],
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          difficulty: true,
          views: true,
          topic: { select: { name: true, slug: true } },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return { questions, total };
  },
};