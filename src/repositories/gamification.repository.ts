// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Gamification Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const gamificationRepository = {
  async getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });
  },

  async getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: "desc" },
    });
  },

  async getXpHistory(userId: string, limit = 50) {
    return prisma.xPHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async getStreak(userId: string) {
    return prisma.learningStreak.findFirst({ where: { userId } });
  },

  async addXp(userId: string, amount: number, source: string) {
    return prisma.xPHistory.create({
      data: { userId, amount, source },
    });
  },
};
