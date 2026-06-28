import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

export async function getArticleBySlug(slug: string) {
  const cacheKey = `article:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchArticle>>>(cacheKey);
  if (cached) return cached;

  const article = await fetchArticle(slug);
  if (article) await setCache(cacheKey, article, 1800);
  return article;
}

async function fetchArticle(slug: string) {
  return prisma.article.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      topic: { select: { name: true, slug: true } },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { name: true, image: true } },
          replies: {
            include: {
              author: { select: { name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function getArticlesByTopic(topicId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { topicId, status: "PUBLISHED", deletedAt: null },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        topic: { select: { name: true, slug: true } },
      },
    }),
    prisma.article.count({ where: { topicId, status: "PUBLISHED", deletedAt: null } }),
  ]);

  return { articles, total, pages: Math.ceil(total / limit) };
}

export async function incrementArticleViews(id: string) {
  await prisma.article.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}
