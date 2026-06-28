// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Topic Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { getCache, setCache, invalidateCache } from "@/lib/redis";
import type { ContentStatus } from "@/generated/prisma/client";

const CACHE_TTL = 600; // 10 min

export const topicRepository = {
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
