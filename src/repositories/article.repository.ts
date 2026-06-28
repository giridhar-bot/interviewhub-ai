// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Article Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { getCache, setCache, invalidateCache } from "@/lib/redis";
import type { ContentStatus } from "@/generated/prisma/client";

const CACHE_TTL = 300; // 5 min

export const articleRepository = {
  async findBySlug(slug: string) {
    const cacheKey = `articles:slug:${slug}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const article = await prisma.article.findUnique({
      where: { slug, deletedAt: null },
      include: {
        topic: true,
        subTopic: true,
        author: { select: { id: true, displayName: true, avatar: true } },
      },
    });

    if (article) await setCache(cacheKey, article, CACHE_TTL);
    return article;
  },

  async findByTopic(topicId: string, page = 1, limit = 20) {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { topicId, status: "PUBLISHED", deletedAt: null },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, displayName: true, avatar: true } },
        },
      }),
      prisma.article.count({
        where: { topicId, status: "PUBLISHED", deletedAt: null },
      }),
    ]);
    return { articles, total, page, totalPages: Math.ceil(total / limit) };
  },

  async incrementViews(id: string) {
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  },

  async create(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    topicId: string;
    subTopicId?: string;
    authorId?: string;
    tags?: string[];
    readTime?: number;
  }) {
    const article = await prisma.article.create({ data });
    await invalidateCache("articles:*");
    return article;
  },

  async update(id: string, data: Partial<{
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    status: ContentStatus;
    updatedBy: string;
  }>) {
    const article = await prisma.article.update({ where: { id }, data });
    await invalidateCache(`articles:*`);
    return article;
  },

  async publish(id: string) {
    return prisma.article.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
  },

  async softDelete(id: string, deletedBy?: string) {
    await prisma.article.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await invalidateCache("articles:*");
  },
};
