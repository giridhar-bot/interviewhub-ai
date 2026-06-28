import { prisma } from "@/lib/prisma";
import type { SearchInput } from "@/lib/validations";

export async function search(input: SearchInput) {
  const { q, type, page, limit } = input;
  const skip = (page - 1) * limit;

  const results: Record<string, unknown[]> = {};
  const counts: Record<string, number> = {};

  if (type === "all" || type === "articles") {
    const where = {
      status: "PUBLISHED" as const,
      deletedAt: null,
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { content: { contains: q, mode: "insensitive" as const } },
      ],
    };
    const [items, count] = await Promise.all([
      prisma.article.findMany({
        where,
        select: { id: true, title: true, slug: true, excerpt: true, readTime: true },
        skip: type === "articles" ? skip : 0,
        take: type === "articles" ? limit : 5,
      }),
      prisma.article.count({ where }),
    ]);
    results.articles = items;
    counts.articles = count;
  }

  if (type === "all" || type === "questions") {
    const where = {
      status: "PUBLISHED" as const,
      deletedAt: null,
      OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { content: { contains: q, mode: "insensitive" as const } },
      ],
    };
    const [items, count] = await Promise.all([
      prisma.question.findMany({
        where,
        select: { id: true, title: true, slug: true, difficulty: true },
        skip: type === "questions" ? skip : 0,
        take: type === "questions" ? limit : 5,
      }),
      prisma.question.count({ where }),
    ]);
    results.questions = items;
    counts.questions = count;
  }

  if (type === "all" || type === "companies") {
    const where = {
      status: "PUBLISHED" as const,
      deletedAt: null,
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ],
    };
    const [items, count] = await Promise.all([
      prisma.company.findMany({
        where,
        select: { id: true, name: true, slug: true, logo: true, industry: true },
        skip: type === "companies" ? skip : 0,
        take: type === "companies" ? limit : 5,
      }),
      prisma.company.count({ where }),
    ]);
    results.companies = items;
    counts.companies = count;
  }

  return { results, counts, page, limit };
}
