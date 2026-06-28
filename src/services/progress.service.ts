// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Progress & Revision Tracker
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

// ─── Mark Article as Read ───────────────────

export async function markArticleRead(userId: string, articleId: string) {
  return prisma.articleProgress.upsert({
    where: { userId_articleId: { userId, articleId } },
    create: { userId, articleId, completed: true },
    update: { completed: true, readAt: new Date() },
  });
}

// ─── Update Learning Progress ───────────────

export async function updateLearningProgress(
  userId: string,
  topicId: string,
  field: "articlesRead" | "quizzesTaken" | "problemsSolved",
  xpEarned: number
) {
  return prisma.learningProgress.upsert({
    where: { userId_topicId: { userId, topicId } },
    create: {
      userId,
      topicId,
      [field]: 1,
      totalXP: xpEarned,
    },
    update: {
      [field]: { increment: 1 },
      totalXP: { increment: xpEarned },
    },
  });
}

// ─── Get User Learning Progress ─────────────

export async function getUserLearningProgress(userId: string) {
  const [topicProgress, articleProgress, quizProgress, codingProgress] = await Promise.all([
    prisma.learningProgress.findMany({
      where: { userId },
      orderBy: { totalXP: "desc" },
    }),
    prisma.articleProgress.count({ where: { userId, completed: true } }),
    prisma.quizProgress.findMany({ where: { userId } }),
    prisma.codingProgress.findMany({ where: { userId, solved: true } }),
  ]);

  return {
    topicProgress,
    totalArticlesRead: articleProgress,
    totalQuizzesTaken: quizProgress.reduce((sum, q) => sum + q.attempts, 0),
    totalProblemsSolved: codingProgress.length,
    totalXP: topicProgress.reduce((sum, t) => sum + t.totalXP, 0),
  };
}

// ─── Generic Progress ───────────────────────

export async function updateProgress(
  userId: string,
  entityType: string,
  entityId: string,
  percentage: number
) {
  const status =
    percentage === 0 ? "not_started" : percentage >= 100 ? "completed" : "in_progress";

  return prisma.userProgress.upsert({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
    create: { userId, entityType, entityId, status, percentage: Math.min(100, percentage) },
    update: { status, percentage: Math.min(100, percentage) },
  });
}

export async function getProgress(userId: string, entityType: string, entityId: string) {
  return prisma.userProgress.findUnique({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });
}

// ─── Daily Goals ────────────────────────────

export async function getDailyGoal(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.dailyGoal.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today },
    update: {},
  });
}

export async function updateDailyGoal(
  userId: string,
  field: "earnedXP" | "articlesRead" | "problemsSolved",
  value: number
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goal = await prisma.dailyGoal.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, [field]: value },
    update: { [field]: { increment: value } },
  });

  // Check if completed
  if (
    goal.earnedXP >= goal.targetXP &&
    goal.articlesRead >= goal.articlesGoal &&
    goal.problemsSolved >= goal.problemsGoal
  ) {
    await prisma.dailyGoal.update({
      where: { userId_date: { userId, date: today } },
      data: { completed: true },
    });
  }

  return goal;
}

// ─── Weekly Goals ───────────────────────────

export async function getWeeklyGoal(userId: string) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  return prisma.weeklyGoal.upsert({
    where: { userId_weekStart: { userId, weekStart } },
    create: { userId, weekStart },
    update: {},
  });
}

// ─── Revision Schedule ──────────────────────

export async function getRevisionSchedule(userId: string) {
  // Get topics that need revision — studied but not recently revised
  const progress = await prisma.learningProgress.findMany({
    where: { userId, totalXP: { gt: 0 } },
    orderBy: { updatedAt: "asc" }, // least recently studied first
    take: 10,
  });

  const lastSessions = await prisma.revisionSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const topicLastRevision = new Map<string, Date>();
  for (const session of lastSessions) {
    for (const topicId of session.topicIds) {
      if (!topicLastRevision.has(topicId)) {
        topicLastRevision.set(topicId, session.createdAt);
      }
    }
  }

  return progress.map((p) => ({
    topicId: p.topicId,
    totalXP: p.totalXP,
    lastStudied: p.updatedAt,
    lastRevised: topicLastRevision.get(p.topicId) || null,
    needsRevision: !topicLastRevision.has(p.topicId) ||
      Date.now() - (topicLastRevision.get(p.topicId)?.getTime() || 0) > 3 * 86400000, // 3 days
  }));
}

// ─── Dashboard Stats ────────────────────────

export async function getDashboardStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, streak: true },
  });

  const [dailyGoal, weeklyGoal, badges, recentActivity] = await Promise.all([
    getDailyGoal(userId),
    getWeeklyGoal(userId),
    prisma.userBadge.count({ where: { userId } }),
    prisma.xPHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return {
    totalXP: user?.xp || 0,
    streak: user?.streak || 0,
    badges,
    dailyGoal,
    weeklyGoal,
    recentActivity,
  };
}
