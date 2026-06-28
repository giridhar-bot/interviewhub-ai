import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

export async function getTopics() {
  const cacheKey = "topics:all";
  const cached = await getCache<Awaited<ReturnType<typeof fetchTopics>>>(cacheKey);
  if (cached) return cached;

  const topics = await fetchTopics();
  await setCache(cacheKey, topics, 3600);
  return topics;
}

async function fetchTopics() {
  return prisma.topic.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: {
      _count: {
        select: { articles: true, questions: true },
      },
    },
  });
}

export async function getTopicBySlug(slug: string) {
  const cacheKey = `topic:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchTopicBySlug>>>(cacheKey);
  if (cached) return cached;

  const topic = await fetchTopicBySlug(slug);
  if (topic) await setCache(cacheKey, topic, 1800);
  return topic;
}

async function fetchTopicBySlug(slug: string) {
  return prisma.topic.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      articles: {
        where: { status: "PUBLISHED", deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      questions: {
        where: { status: "PUBLISHED", deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      roadmaps: { where: { status: "PUBLISHED", deletedAt: null } },
      cheatSheets: { where: { status: "PUBLISHED", deletedAt: null } },
      _count: {
        select: { articles: true, questions: true, flashcardDecks: true },
      },
    },
  });
}
