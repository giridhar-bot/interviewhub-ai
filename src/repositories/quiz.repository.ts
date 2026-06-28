// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Quiz Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const quizRepository = {
  async findByTopic(topicId: string, page = 1, limit = 20) {
    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where: { topicId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { questions: true, attempts: true } } },
      }),
      prisma.quiz.count({ where: { topicId } }),
    ]);
    return { quizzes, total, page, totalPages: Math.ceil(total / limit) };
  },

  async findById(id: string) {
    return prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    });
  },

  async createAttempt(data: { quizId: string; userId: string }) {
    return prisma.quizAttempt.create({
      data: {
        ...data,
        startedAt: new Date(),
        score: 0,
        total: 0,
        answers: {},
      },
    });
  },
};
