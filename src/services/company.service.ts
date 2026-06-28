import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

export async function getCompanies() {
  const cacheKey = "companies:all";
  const cached = await getCache<Awaited<ReturnType<typeof fetchCompanies>>>(cacheKey);
  if (cached) return cached;

  const companies = await fetchCompanies();
  await setCache(cacheKey, companies, 3600);
  return companies;
}

async function fetchCompanies() {
  return prisma.company.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { questions: true, experiences: true },
      },
    },
  });
}

export async function getCompanyBySlug(slug: string) {
  return prisma.company.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      questions: {
        where: { status: "PUBLISHED", deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      experiences: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: { select: { name: true, image: true } },
        },
      },
      _count: {
        select: { questions: true, experiences: true },
      },
    },
  });
}
