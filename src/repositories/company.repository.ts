// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Company Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { getCache, setCache, invalidateCache } from "@/lib/redis";

const CACHE_TTL = 600;

export const companyRepository = {
  async findAll(page = 1, limit = 20) {
    const cacheKey = `companies:page:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { questions: true, experiences: true } },
        },
      }),
      prisma.company.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    ]);

    const result = { companies, total, page, totalPages: Math.ceil(total / limit) };
    await setCache(cacheKey, result, CACHE_TTL);
    return result;
  },

  async findBySlug(slug: string) {
    const cacheKey = `companies:slug:${slug}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const company = await prisma.company.findUnique({
      where: { slug, deletedAt: null },
      include: {
        companyRoles: true,
        interviewRounds: {
          orderBy: { order: "asc" },
          include: { questions: true },
        },
        _count: {
          select: { questions: true, experiences: true, salaryInsights: true },
        },
      },
    });

    if (company) await setCache(cacheKey, company, CACHE_TTL);
    return company;
  },

  async findByIndustry(industry: string) {
    return prisma.company.findMany({
      where: { industry, status: "PUBLISHED", deletedAt: null },
      orderBy: { name: "asc" },
    });
  },

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    industry?: string;
    website?: string;
    headquarters?: string;
    techStack?: string[];
  }) {
    const company = await prisma.company.create({ data });
    await invalidateCache("companies:*");
    return company;
  },

  async softDelete(id: string) {
    await prisma.company.update({ where: { id }, data: { deletedAt: new Date() } });
    await invalidateCache("companies:*");
  },
};
