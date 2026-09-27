// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Topic Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { getCache, setCache, invalidateCache } from "@/lib/redis";
import type { ContentStatus } from "@/generated/prisma/client";

const CACHE_TTL = 600; // 10 min

export const topicRepository = {
  async findPublishedDirectory() {
    return prisma.topic.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      orderBy: [{ category: "asc" }, { order: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        description: true,
        _count: {
          select: {
            questions: { where: { status: "PUBLISHED", deletedAt: null } },
            articles: { where: { status: "PUBLISHED", deletedAt: null } },
            roadmaps: { where: { status: "PUBLISHED", isPublished: true, deletedAt: null } },
          },
        },
      },
    });
  },

  async findPublishedSummaries() {
    return prisma.topic.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: { id: true, name: true, slug: true, order: true },
      orderBy: { order: "asc" },
    });
  },

  async findPublishedBySlug(slug: string) {
    return prisma.topic.findUnique({
      where: { slug, status: "PUBLISHED", deletedAt: null },
      select: { id: true, name: true, slug: true, description: true, category: true },
    });
  },

  async findPublicPageBySlug(slug: string) {
    return prisma.topic.findUnique({
      where: { slug, status: "PUBLISHED", deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        questions: {
          where: { status: "PUBLISHED", deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 6,
          select: { id: true, title: true, slug: true, content: true, difficulty: true },
        },
        articles: {
          where: { status: "PUBLISHED", deletedAt: null },
          orderBy: { publishedAt: "desc" },
          take: 6,
          select: { id: true, title: true, slug: true, excerpt: true, shortDescription: true, readTime: true },
        },
        roadmaps: {
          where: { status: "PUBLISHED", isPublished: true, deletedAt: null },
          orderBy: { updatedAt: "desc" },
          take: 6,
          select: { id: true, title: true, slug: true, description: true, estimatedHours: true },
        },
        cheatSheets: {
          where: { status: "PUBLISHED", deletedAt: null },
          orderBy: { updatedAt: "desc" },
          take: 6,
          select: { id: true, title: true, slug: true, content: true },
        },
        _count: {
          select: {
            questions: { where: { status: "PUBLISHED", deletedAt: null } },
            articles: { where: { status: "PUBLISHED", deletedAt: null } },
            roadmaps: { where: { status: "PUBLISHED", isPublished: true, deletedAt: null } },
            cheatSheets: { where: { status: "PUBLISHED", deletedAt: null } },
          },
        },
      },
    });
  },

  async findAll(status?: ContentStatus) {
    const cacheKey = `topics:all:${status ?? "all"}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const topics = await prisma.topic.findMany({
      where: {
        ...(status ? { status } : {}),
        deletedAt: null,
      },
      orderBy: { order: "asc" },
      include: { _count: { select: { articles: true, questions: true } } },
    });

    await setCache(cacheKey, topics, CACHE_TTL);
    return topics;
  },

  async findBySlug(slug: string) {
    const cacheKey = `topics:slug:${slug}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const topic = await prisma.topic.findUnique({
      where: { slug, deletedAt: null },
      include: {
        subTopics: { orderBy: { order: "asc" } },
        _count: {
          select: { articles: true, questions: true, roadmaps: true, quizzes: true },
        },
      },
    });

    if (topic) await setCache(cacheKey, topic, CACHE_TTL);
    return topic;
  },

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    category: string;
    order?: number;
  }) {
    const topic = await prisma.topic.create({ data });
    await invalidateCache("topics:*");
    return topic;
  },

  async update(id: string, data: Partial<{ name: string; description: string; icon: string; order: number; status: ContentStatus }>) {
    const topic = await prisma.topic.update({ where: { id }, data });
    await invalidateCache("topics:*");
    return topic;
  },

  async softDelete(id: string) {
    await prisma.topic.update({ where: { id }, data: { deletedAt: new Date() } });
    await invalidateCache("topics:*");
  },
};
