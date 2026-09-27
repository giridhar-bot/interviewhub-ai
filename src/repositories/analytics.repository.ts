// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Analytics Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const analyticsRepository = {
  async getAIUsageOverview() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.aIUsageHistory.findMany({
      where: { createdAt: { gte: today } },
      select: { feature: true, model: true, tokensUsed: true, cost: true },
    });

    const byModel = new Map<string, { requests: number; tokens: number; cost: number }>();
    for (const entry of usage) {
      const item = byModel.get(entry.model) ?? { requests: 0, tokens: 0, cost: 0 };
      item.requests += 1;
      item.tokens += entry.tokensUsed;
      item.cost += entry.cost ?? 0;
      byModel.set(entry.model, item);
    }

    return {
      requests: usage.length,
      tokens: usage.reduce((sum, entry) => sum + entry.tokensUsed, 0),
      cost: usage.reduce((sum, entry) => sum + (entry.cost ?? 0), 0),
      models: Array.from(byModel, ([model, totals]) => ({ model, ...totals })),
    };
  },

  async getAdminOverview(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [
      pageViews,
      sessions,
      singlePageSessions,
      averageDuration,
      topPageGroups,
      topics,
      publishedTopics,
      articles,
      publishedArticles,
      questions,
      publishedQuestions,
      companies,
      publishedCompanies,
      codingProblems,
      publishedCodingProblems,
    ] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      prisma.sessionAnalytics.count({ where: { startedAt: { gte: since } } }),
      prisma.sessionAnalytics.count({ where: { startedAt: { gte: since }, pageCount: 1 } }),
      prisma.sessionAnalytics.aggregate({
        where: { startedAt: { gte: since } },
        _avg: { duration: true },
      }),
      prisma.pageView.groupBy({
        by: ["path"],
        where: { createdAt: { gte: since } },
        _count: true,
        orderBy: { _count: { path: "desc" } },
        take: 8,
      }),
      prisma.topic.count({ where: { deletedAt: null } }),
      prisma.topic.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.article.count({ where: { deletedAt: null } }),
      prisma.article.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.question.count({ where: { deletedAt: null } }),
      prisma.question.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.company.count({ where: { deletedAt: null } }),
      prisma.company.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.codingProblem.count({ where: { deletedAt: null } }),
      prisma.codingProblem.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    ]);

    return {
      pageViews,
      sessions,
      averageDurationSeconds: averageDuration._avg.duration ?? 0,
      bounceRate: sessions ? (singlePageSessions / sessions) * 100 : 0,
      topPages: topPageGroups.map(({ path, _count }) => ({ path, views: _count })),
      content: [
        { type: "Topics", total: topics, published: publishedTopics },
        { type: "Articles", total: articles, published: publishedArticles },
        { type: "Interview Questions", total: questions, published: publishedQuestions },
        { type: "Companies", total: companies, published: publishedCompanies },
        { type: "Coding Problems", total: codingProblems, published: publishedCodingProblems },
      ],
    };
  },

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
