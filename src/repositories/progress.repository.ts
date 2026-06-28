// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Progress & Gamification Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const progressRepository = {
  // ── XP ──────────────────────────────────────
  async addXP(userId: string, amount: number, source: string, sourceId?: string) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: amount } },
      }),
      prisma.xPHistory.create({
        data: { userId, amount, source, sourceId },
      }),
    ]);
  },

  async getXPHistory(userId: string, limit = 50) {
    return prisma.xPHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  // ── Streak ──────────────────────────────────
  async updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeStreak = await prisma.learningStreak.findFirst({
      where: { userId, active: true },
      orderBy: { endDate: "desc" },
    });

    if (activeStreak) {
      const lastDate = new Date(activeStreak.endDate);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / 86400000);

      if (diffDays === 0) return activeStreak; // already updated today
      if (diffDays === 1) {
        // Extend streak
        return prisma.learningStreak.update({
          where: { id: activeStreak.id },
          data: { endDate: today, length: { increment: 1 } },
        });
      }
      // Streak broken — deactivate and start new
      await prisma.learningStreak.update({
        where: { id: activeStreak.id },
        data: { active: false },
      });
    }

    // Start new streak
    return prisma.learningStreak.create({
      data: { userId, startDate: today, endDate: today, length: 1 },
    });
  },

  // ── Daily Goals ─────────────────────────────
  async getDailyGoal(userId: string, date?: Date) {
    const d = date ?? new Date();
    d.setHours(0, 0, 0, 0);

    return prisma.dailyGoal.upsert({
      where: { userId_date: { userId, date: d } },
      update: {},
      create: { userId, date: d },
    });
  },

  async updateDailyGoal(userId: string, data: {
    earnedXP?: number;
    articlesRead?: number;
    problemsSolved?: number;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.dailyGoal.update({
      where: { userId_date: { userId, date: today } },
      data: {
        ...(data.earnedXP ? { earnedXP: { increment: data.earnedXP } } : {}),
        ...(data.articlesRead ? { articlesRead: { increment: data.articlesRead } } : {}),
        ...(data.problemsSolved ? { problemsSolved: { increment: data.problemsSolved } } : {}),
      },
    });
  },

  // ── Badges ──────────────────────────────────
  async awardBadge(userId: string, badgeId: string) {
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    });
    if (existing) return existing;

    return prisma.userBadge.create({ data: { userId, badgeId } });
  },

  async getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });
  },

  // ── Learning Progress ──────────────────────
  async updateLearningProgress(userId: string, topicId: string, data: {
    articlesRead?: number;
    quizzesTaken?: number;
    problemsSolved?: number;
    xp?: number;
  }) {
    return prisma.learningProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: {
        ...(data.articlesRead ? { articlesRead: { increment: data.articlesRead } } : {}),
        ...(data.quizzesTaken ? { quizzesTaken: { increment: data.quizzesTaken } } : {}),
        ...(data.problemsSolved ? { problemsSolved: { increment: data.problemsSolved } } : {}),
        ...(data.xp ? { totalXP: { increment: data.xp } } : {}),
      },
      create: {
        userId,
        topicId,
        articlesRead: data.articlesRead ?? 0,
        quizzesTaken: data.quizzesTaken ?? 0,
        problemsSolved: data.problemsSolved ?? 0,
        totalXP: data.xp ?? 0,
      },
    });
  },

  // ── Coding Progress ─────────────────────────
  async updateCodingProgress(userId: string, problemId: string, solved: boolean, runtime?: number, memory?: number) {
    return prisma.codingProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      update: {
        attempts: { increment: 1 },
        ...(solved ? { solved: true, firstSolvedAt: new Date() } : {}),
        ...(runtime ? { bestRuntime: runtime } : {}),
        ...(memory ? { bestMemory: memory } : {}),
      },
      create: {
        userId,
        problemId,
        solved,
        attempts: 1,
        ...(solved ? { firstSolvedAt: new Date() } : {}),
        ...(runtime ? { bestRuntime: runtime } : {}),
        ...(memory ? { bestMemory: memory } : {}),
      },
    });
  },
};
