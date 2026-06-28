import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import {
  getUserLearningProgress,
  getDashboardStats,
  getRevisionSchedule,
  markArticleRead,
  updateProgress,
  getProgress,
} from "@/services/progress.service";
import {
  getLeaderboard,
  getUserRank,
  getUserBadges,
  getUserAchievements,
  getXPHistory,
  getStreak,
} from "@/services/gamification.service";
import { awardXP, XP_VALUES, updateStreak } from "@/services/gamification.service";
import { updateLearningProgress, updateDailyGoal } from "@/services/progress.service";

// GET /api/progress
export async function GET(request: NextRequest) {
  const user = await requireAuth();
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  switch (action) {
    case "dashboard": {
      const stats = await getDashboardStats(user.id);
      return NextResponse.json(stats);
    }
    case "learning": {
      const progress = await getUserLearningProgress(user.id);
      return NextResponse.json(progress);
    }
    case "revision": {
      const schedule = await getRevisionSchedule(user.id);
      return NextResponse.json(schedule);
    }
    case "leaderboard": {
      const [leaderboard, rank] = await Promise.all([
        getLeaderboard(),
        getUserRank(user.id),
      ]);
      return NextResponse.json({ leaderboard, userRank: rank });
    }
    case "badges": {
      const badges = await getUserBadges(user.id);
      return NextResponse.json(badges);
    }
    case "achievements": {
      const achievements = await getUserAchievements(user.id);
      return NextResponse.json(achievements);
    }
    case "xp-history": {
      const history = await getXPHistory(user.id);
      return NextResponse.json(history);
    }
    case "streak": {
      const streak = await getStreak(user.id);
      return NextResponse.json(streak);
    }
    case "check": {
      const entityType = searchParams.get("entityType");
      const entityId = searchParams.get("entityId");
      if (!entityType || !entityId) {
        return NextResponse.json({ error: "Missing params" }, { status: 400 });
      }
      const progress = await getProgress(user.id, entityType, entityId);
      return NextResponse.json(progress);
    }
    default: {
      const stats = await getDashboardStats(user.id);
      return NextResponse.json(stats);
    }
  }
}

// POST /api/progress
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();
  const { action } = body;

  // Mark article as read
  if (action === "article-read") {
    const { articleId, topicId } = body;
    if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 });

    await markArticleRead(user.id, articleId);
    await awardXP(user.id, XP_VALUES.articleRead, "article", articleId);
    await updateStreak(user.id);
    await updateDailyGoal(user.id, "articlesRead", 1);
    await updateDailyGoal(user.id, "earnedXP", XP_VALUES.articleRead);

    if (topicId) {
      await updateLearningProgress(user.id, topicId, "articlesRead", XP_VALUES.articleRead);
    }

    return NextResponse.json({ xpEarned: XP_VALUES.articleRead });
  }

  // Update generic progress
  if (action === "update") {
    const { entityType, entityId, percentage } = body;
    if (!entityType || !entityId || percentage === undefined) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }
    const progress = await updateProgress(user.id, entityType, entityId, percentage);
    return NextResponse.json(progress);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
