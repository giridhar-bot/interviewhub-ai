import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

// ═══════════════════════════════════════════════
// RELATED CONTENT ENGINE
// ═══════════════════════════════════════════════

const CACHE_TTL = 1800; // 30 minutes

export interface RelatedContent {
  id: string;
  title: string;
  slug: string;
  type: "article" | "topic" | "company" | "roadmap" | "cheatsheet" | "problem";
  excerpt?: string;
  category?: string;
  difficulty?: string;
  views?: number;
}

// ─── Related Articles (by tags + topic) ──────

export async function getRelatedArticles(
  articleId: string,
  topicId: string,
  tags: string[],
  limit = 6
): Promise<RelatedContent[]> {
  const cacheKey = `related:articles:${articleId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // First try: articles with same tags
  const byTags = tags.length
    ? await prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          id: { not: articleId },
          tags: { hasSome: tags },
        },
        select: { id: true, title: true, slug: true, excerpt: true, views: true },
        take: limit,
        orderBy: { views: "desc" },
      })
    : [];

  // Fill remaining from same topic
  const remaining = limit - byTags.length;
  const byTopic =
    remaining > 0
      ? await prisma.article.findMany({
          where: {
            status: "PUBLISHED",
            deletedAt: null,
            topicId,
            id: { notIn: [articleId, ...byTags.map((a) => a.id)] },
          },
          select: { id: true, title: true, slug: true, excerpt: true, views: true },
          take: remaining,
          orderBy: { views: "desc" },
        })
      : [];

  const results: RelatedContent[] = [...byTags, ...byTopic].map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    type: "article",
    excerpt: a.excerpt || undefined,
    views: a.views,
  }));

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(results));
  return results;
}

// ─── Recommended for Topic ───────────────────

export async function getTopicRecommendations(
  topicId: string,
  category: string
): Promise<{
  articles: RelatedContent[];
  roadmaps: RelatedContent[];
  cheatSheets: RelatedContent[];
  codingProblems: RelatedContent[];
}> {
  const cacheKey = `related:topic-recs:${topicId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [articles, roadmaps, cheatSheets, codingProblems] = await Promise.all([
    prisma.article.findMany({
      where: { topicId, status: "PUBLISHED", deletedAt: null },
      select: { id: true, title: true, slug: true, excerpt: true, views: true },
      take: 6,
      orderBy: { views: "desc" },
    }),
    prisma.roadmap.findMany({
      where: { topicId, status: "PUBLISHED", deletedAt: null },
      select: { id: true, title: true, slug: true, description: true },
      take: 3,
    }),
    prisma.cheatSheet.findMany({
      where: { topicId, status: "PUBLISHED", deletedAt: null },
      select: { id: true, title: true, slug: true },
      take: 3,
    }),
    prisma.codingProblem.findMany({
      where: { category, status: "PUBLISHED", deletedAt: null },
      select: { id: true, title: true, slug: true, difficulty: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const result = {
    articles: articles.map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      type: "article" as const,
      excerpt: a.excerpt || undefined,
      views: a.views,
    })),
    roadmaps: roadmaps.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      type: "roadmap" as const,
      excerpt: r.description || undefined,
    })),
    cheatSheets: cheatSheets.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      type: "cheatsheet" as const,
    })),
    codingProblems: codingProblems.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      type: "problem" as const,
      difficulty: p.difficulty,
    })),
  };

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  return result;
}

// ─── Trending Content ────────────────────────

export async function getTrendingContent(limit = 10): Promise<RelatedContent[]> {
  const cacheKey = "related:trending";
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
      },
    },
    select: { id: true, title: true, slug: true, excerpt: true, views: true },
    take: limit,
    orderBy: { views: "desc" },
  });

  const results: RelatedContent[] = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    type: "article",
    excerpt: a.excerpt || undefined,
    views: a.views,
  }));

  await redis?.setex(cacheKey, 900, JSON.stringify(results)); // 15 min cache
  return results;
}

// ─── Content Cluster (for topic hubs) ────────

export async function getContentCluster(topicId: string): Promise<{
  topic: { name: string; slug: string } | null;
  subTopics: { name: string; slug: string }[];
  articleCount: number;
  questionCount: number;
  roadmapCount: number;
  cheatSheetCount: number;
  quizCount: number;
  problemCount: number;
}> {
  const cacheKey = `related:cluster:${topicId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [topic, subTopics, articleCount, questionCount, roadmapCount, cheatSheetCount, quizCount, problemCount] =
    await Promise.all([
      prisma.topic.findUnique({
        where: { id: topicId },
        select: { name: true, slug: true },
      }),
      prisma.subTopic.findMany({
        where: { topicId, status: "PUBLISHED" },
        select: { name: true, slug: true },
        orderBy: { order: "asc" },
      }),
      prisma.article.count({ where: { topicId, status: "PUBLISHED", deletedAt: null } }),
      prisma.question.count({ where: { topicId } }),
      prisma.roadmap.count({ where: { topicId, status: "PUBLISHED", deletedAt: null } }),
      prisma.cheatSheet.count({ where: { topicId, status: "PUBLISHED", deletedAt: null } }),
      prisma.quiz.count({ where: { topicId, status: "PUBLISHED" } }),
      prisma.codingProblem.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    ]);

  const result = {
    topic,
    subTopics,
    articleCount,
    questionCount,
    roadmapCount,
    cheatSheetCount,
    quizCount,
    problemCount,
  };

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  return result;
}

// ─── "You May Also Like" ─────────────────────

export async function getRecommendedForUser(
  userId: string,
  limit = 6
): Promise<RelatedContent[]> {
  // Get user's recent progress to infer interests
  const recentProgress = await prisma.learningProgress.findMany({
    where: { userId },
    select: { topicId: true },
    take: 5,
    orderBy: { updatedAt: "desc" },
  });

  const topicIds = [...new Set(recentProgress.map((p) => p.topicId))];
  if (!topicIds.length) {
    return getTrendingContent(limit);
  }

  const articles = await prisma.article.findMany({
    where: {
      topicId: { in: topicIds },
      status: "PUBLISHED",
      deletedAt: null,
    },
    select: { id: true, title: true, slug: true, excerpt: true, views: true },
    take: limit,
    orderBy: { views: "desc" },
  });

  return articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    type: "article",
    excerpt: a.excerpt || undefined,
    views: a.views,
  }));
}
