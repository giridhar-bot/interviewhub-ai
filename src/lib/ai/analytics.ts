import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";
import type { AIModule } from "./gateway";
import type { AIModel } from "./providers";

// ═══════════════════════════════════════════════
// AI ANALYTICS & COST MONITORING
// ═══════════════════════════════════════════════

interface AIUsageEvent {
  module: AIModule;
  userId: string;
  model: AIModel | string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  latencyMs: number;
  cached: boolean;
}

// ─── Track Usage ─────────────────────────────

export async function trackAIUsage(event: AIUsageEvent): Promise<void> {
  try {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Aggregate by day + module
    const dailyKey = `ai:stats:${date}:${event.module}`;
    await redis?.hincrby(dailyKey, "requests", 1);
    await redis?.hincrby(dailyKey, "inputTokens", event.inputTokens);
    await redis?.hincrby(dailyKey, "outputTokens", event.outputTokens);
    await redis?.hincrbyfloat(dailyKey, "cost", event.cost);
    await redis?.hincrby(dailyKey, "totalLatency", event.latencyMs);
    if (event.cached) await redis?.hincrby(dailyKey, "cacheHits", 1);
    await redis?.expire(dailyKey, 86400 * 90); // keep 90 days

    // Aggregate by day + model
    const modelKey = `ai:model:${date}:${event.model}`;
    await redis?.hincrby(modelKey, "requests", 1);
    await redis?.hincrby(modelKey, "inputTokens", event.inputTokens);
    await redis?.hincrby(modelKey, "outputTokens", event.outputTokens);
    await redis?.hincrbyfloat(modelKey, "cost", event.cost);
    await redis?.expire(modelKey, 86400 * 90);

    // User daily usage
    const userKey = `ai:user:${date}:${event.userId}`;
    await redis?.hincrby(userKey, "requests", 1);
    await redis?.hincrby(userKey, "tokens", event.inputTokens + event.outputTokens);
    await redis?.hincrbyfloat(userKey, "cost", event.cost);
    await redis?.expire(userKey, 86400 * 30);

    // Global daily totals
    const globalKey = `ai:global:${date}`;
    await redis?.hincrby(globalKey, "requests", 1);
    await redis?.hincrby(globalKey, "tokens", event.inputTokens + event.outputTokens);
    await redis?.hincrbyfloat(globalKey, "cost", event.cost);
    await redis?.expire(globalKey, 86400 * 90);

    logger.debug("AI usage tracked", {
      module: event.module,
      model: event.model,
      tokens: event.inputTokens + event.outputTokens,
      cost: event.cost.toFixed(6),
      latency: event.latencyMs,
    });
  } catch (error) {
    logger.error("Failed to track AI usage", { error });
  }
}

// ─── Get Daily Stats ─────────────────────────

export async function getDailyStats(date?: string): Promise<Record<string, unknown>> {
  const d = date || new Date().toISOString().split("T")[0];

  const globalKey = `ai:global:${d}`;
  const globalStats = await redis?.hgetall(globalKey);

  // Get per-module stats
  const modules: AIModule[] = [
    "tutor", "doubtSolver", "mockInterview", "resumeATS",
    "codeReview", "codeExplainer", "roadmapGenerator", "studyPlanner",
    "flashcardGenerator", "quizGenerator", "systemDesignReviewer",
    "careerAdvisor", "salaryInsights",
  ];

  const moduleStats: Record<string, Record<string, string>> = {};
  for (const mod of modules) {
    const stats = await redis?.hgetall(`ai:stats:${d}:${mod}`);
    if (stats && Object.keys(stats).length > 0) {
      moduleStats[mod] = stats;
    }
  }

  return {
    date: d,
    global: globalStats || {},
    modules: moduleStats,
  };
}

// ─── Get User Usage ──────────────────────────

export async function getUserDailyUsage(
  userId: string,
  date?: string
): Promise<{ requests: number; tokens: number; cost: number }> {
  const d = date || new Date().toISOString().split("T")[0];
  const stats = await redis?.hgetall(`ai:user:${d}:${userId}`);

  return {
    requests: parseInt(stats?.requests || "0", 10),
    tokens: parseInt(stats?.tokens || "0", 10),
    cost: parseFloat(stats?.cost || "0"),
  };
}

// ─── Usage Limits ────────────────────────────

const DAILY_LIMITS = {
  FREE: { requests: 20, tokens: 50000 },
  PRO: { requests: 200, tokens: 500000 },
  ENTERPRISE: { requests: 1000, tokens: 2000000 },
};

export async function checkUsageLimit(
  userId: string,
  plan: "FREE" | "PRO" | "ENTERPRISE"
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const usage = await getUserDailyUsage(userId);
  const limit = DAILY_LIMITS[plan];

  return {
    allowed: usage.requests < limit.requests && usage.tokens < limit.tokens,
    remaining: Math.max(0, limit.requests - usage.requests),
    limit: limit.requests,
  };
}

// ─── Cost Report (for admin) ─────────────────

export async function getCostReport(
  days = 7
): Promise<{ date: string; cost: number; requests: number; tokens: number }[]> {
  const report: { date: string; cost: number; requests: number; tokens: number }[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const d = date.toISOString().split("T")[0];

    const stats = await redis?.hgetall(`ai:global:${d}`);
    report.push({
      date: d,
      cost: parseFloat(stats?.cost || "0"),
      requests: parseInt(stats?.requests || "0", 10),
      tokens: parseInt(stats?.tokens || "0", 10),
    });
  }

  return report;
}
