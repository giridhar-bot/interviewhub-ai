// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Gamification Service (XP, Badges, Streaks)
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

// ─── XP Constants ───────────────────────────

export const XP_VALUES = {
  articleRead: 10,
  quizComplete: 25,
  quizPerfect: 50,
  problemSolved: 30,
  flashcardReview: 5,
  dailyGoalComplete: 20,
  streakBonus: 10, // per day
  firstSubmission: 15,
} as const;

// ─── Award XP ───────────────────────────────

export async function awardXP(
  userId: string,
  amount: number,
  source: string,
  sourceId?: string
) {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: amount } },
    }),
    prisma.xPHistory.create({
      data: { userId, amount, source, sourceId },
    }),
  ]);

  // Check for badge unlocks
  await checkBadgeUnlocks(userId);

  return { awarded: amount, source };
}

// ─── Get XP History ─────────────────────────

export async function getXPHistory(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return prisma.xPHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
}

// ─── Streaks ────────────────────────────────

export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Find active streak
  const activeStreak = await prisma.learningStreak.findFirst({
    where: { userId, active: true },
    orderBy: { endDate: "desc" },
  });

  if (activeStreak) {
    const endDate = new Date(activeStreak.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (endDate.getTime() === today.getTime()) {
      // Already updated today
      return activeStreak;
    }

    if (endDate.getTime() === yesterday.getTime()) {
      // Extend streak
      const updated = await prisma.learningStreak.update({
        where: { id: activeStreak.id },
        data: {
          endDate: today,
          length: { increment: 1 },
        },
      });

      await prisma.user.update({
        where: { id: userId },
        data: { streak: updated.length },
      });

      // Streak bonus XP
      if (updated.length % 7 === 0) {
        await awardXP(userId, XP_VALUES.streakBonus * 7, "streak", activeStreak.id);
      }

      return updated;
    }

    // Streak broken — deactivate
    await prisma.learningStreak.update({
      where: { id: activeStreak.id },
      data: { active: false },
    });
  }

  // Start new streak
  const newStreak = await prisma.learningStreak.create({
    data: {
      userId,
      startDate: today,
      endDate: today,
      length: 1,
      active: true,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { streak: 1 },
  });

  return newStreak;
}

export async function getStreak(userId: string) {
  return prisma.learningStreak.findFirst({
    where: { userId, active: true },
    orderBy: { endDate: "desc" },
  });
}

// ─── Badges ─────────────────────────────────

export async function getBadges() {
  return prisma.badge.findMany({
    orderBy: { category: "asc" },
  });
}

export async function getUserBadges(userId: string) {
  return prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: "desc" },
  });
}

async function checkBadgeUnlocks(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, streak: true },
  });
  if (!user) return;

  const earnedBadgeIds = (
    await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    })
  ).map((b) => b.badgeId);

  const allBadges = await prisma.badge.findMany({
    where: { id: { notIn: earnedBadgeIds } },
  });

  // Check each badge criteria
  for (const badge of allBadges) {
    const criteria = badge.criteria as { type: string; threshold: number };
    let met = false;

    switch (criteria.type) {
      case "xp_total":
        met = user.xp >= criteria.threshold;
        break;
      case "streak_days":
        met = user.streak >= criteria.threshold;
        break;
      case "problems_solved": {
        const solved = await prisma.codingProgress.count({
          where: { userId, solved: true },
        });
        met = solved >= criteria.threshold;
        break;
      }
      case "articles_read": {
        const read = await prisma.articleProgress.count({
          where: { userId, completed: true },
        });
        met = read >= criteria.threshold;
        break;
      }
      case "quizzes_completed": {
        const quizzes = await prisma.quizAttempt.groupBy({
          by: ["quizId"],
          where: { userId },
        });
        met = quizzes.length >= criteria.threshold;
        break;
      }
    }

    if (met) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
      if (badge.xpReward > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: badge.xpReward } },
        });
      }
    }
  }
}

// ─── Achievements ───────────────────────────

export async function getUserAchievements(userId: string) {
  return prisma.userAchievement.findMany({
    where: { userId },
    include: { achievement: true },
    orderBy: { earnedAt: "desc" },
  });
}

// ─── Leaderboard ────────────────────────────

export async function getLeaderboard(limit = 20) {
  return prisma.user.findMany({
    where: { deletedAt: null, bannedAt: null },
    orderBy: { xp: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      displayName: true,
      username: true,
      image: true,
      xp: true,
      streak: true,
    },
  });
}

export async function getUserRank(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });
  if (!user) return null;

  const rank = await prisma.user.count({
    where: { xp: { gt: user.xp }, deletedAt: null, bannedAt: null },
  });

  return rank + 1;
}
