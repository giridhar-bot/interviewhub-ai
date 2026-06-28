// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Analytics Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const analyticsRepository = {
  // ── Page Views ──────────────────────────────
  async trackPageView(data: {
    path: string;
    userId?: string;
    sessionId?: string;
    referrer?: string;
    userAgent?: string;
    country?: string;
    device?: string;
  }) {
    return prisma.pageView.create({ data });
  },

  async getPageViews(path: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.pageView.groupBy({
      by: ["path"],
      where: { path, createdAt: { gte: since } },
      _count: true,
    });
  },

  // ── Events ──────────────────────────────────
  async trackEvent(data: {
    name: string;
    userId?: string;
    sessionId?: string;
    properties?: object;
  }) {
    return prisma.analyticsEvent.create({ data });
  },

  // ── Content Analytics ──────────────────────
  async updateContentAnalytics(entityType: string, entityId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.contentAnalytics.upsert({
      where: {
        entityType_entityId_date: { entityType, entityId, date: today },
      },
      update: { views: { increment: 1 } },
      create: { entityType, entityId, date: today, views: 1 },
    });
  },

  async getContentStats(entityType: string, entityId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.contentAnalytics.findMany({
      where: { entityType, entityId, date: { gte: since } },
      orderBy: { date: "asc" },
    });
  },

  // ── Search Analytics ───────────────────────
  async trackSearch(query: string, resultsCount: number, userId?: string) {
    await Promise.all([
      prisma.searchAnalytics.create({ data: { query, resultsCount, userId } }),
      prisma.searchKeyword.upsert({
        where: { keyword: query.toLowerCase() },
        update: { count: { increment: 1 }, lastSearched: new Date() },
        create: { keyword: query.toLowerCase() },
      }),
    ]);
  },

  async getTrendingSearches(limit = 10) {
    return prisma.searchKeyword.findMany({
      orderBy: { count: "desc" },
      take: limit,
    });
  },

  // ── Dashboard Stats ────────────────────────
  async getDashboardStats() {
    const [users, articles, problems, posts] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.article.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.codingProblem.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.post.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    ]);

    return { users, articles, problems, posts };
  },
};
