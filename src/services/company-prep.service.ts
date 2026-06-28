// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Company Preparation Service
// Company profiles, prep plans, question banks, salary insights
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getCache, setCache } from "@/lib/redis";

// ─── Company Profile ────────────────────────

export async function getCompanyProfile(slug: string) {
  const cacheKey = `company:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchCompany>>>(cacheKey);
  if (cached) return cached;

  const company = await fetchCompany(slug);
  if (company) await setCache(cacheKey, company, 3600);
  return company;
}

async function fetchCompany(slug: string) {
  return prisma.company.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      companyRoles: { orderBy: { title: "asc" } },
      interviewRounds: { orderBy: { order: "asc" } },
      _count: {
        select: {
          questions: true,
          experiences: true,
          salaryInsights: true,
          problemCompanies: true,
        },
      },
    },
  });
}

// ─── Company List ───────────────────────────

export async function getCompanies(options?: {
  industry?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { industry, search, page = 1, limit = 30 } = options || {};
  const skip = (page - 1) * limit;

  const where: Prisma.CompanyWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    ...(industry && { industry }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        industry: true,
        headquarters: true,
        techStack: true,
        _count: { select: { questions: true, experiences: true } },
      },
    }),
    prisma.company.count({ where }),
  ]);

  return { companies, total, pages: Math.ceil(total / limit) };
}

// ─── Company Questions ──────────────────────

export async function getCompanyQuestions(
  companyId: string,
  options?: {
    type?: "THEORY" | "CODING" | "SYSTEM_DESIGN" | "BEHAVIORAL" | "HR";
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    topicId?: string;
    page?: number;
    limit?: number;
  }
) {
  const { type, difficulty, topicId, page = 1, limit = 20 } = options || {};
  const skip = (page - 1) * limit;

  const where: Prisma.QuestionWhereInput = {
    companyId,
    status: "PUBLISHED",
    deletedAt: null,
    ...(type && { type }),
    ...(difficulty && { difficulty }),
    ...(topicId && { topicId }),
  };

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { views: "desc" },
      skip,
      take: limit,
      include: {
        topic: { select: { name: true, slug: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return { questions, total, pages: Math.ceil(total / limit) };
}

// ─── Interview Experiences ──────────────────

export async function getCompanyExperiences(
  companyId: string,
  page = 1,
  limit = 10
) {
  const skip = (page - 1) * limit;
  const [experiences, total] = await Promise.all([
    prisma.interviewExperience.findMany({
      where: { companyId, status: "PUBLISHED", deletedAt: null },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        author: { select: { name: true, image: true } },
      },
    }),
    prisma.interviewExperience.count({
      where: { companyId, status: "PUBLISHED", deletedAt: null },
    }),
  ]);

  return { experiences, total, pages: Math.ceil(total / limit) };
}

export async function createExperience(data: {
  title: string;
  content: string;
  authorId: string;
  companyId: string;
  role: string;
  result: "SELECTED" | "REJECTED" | "IN_PROGRESS" | "WAITLISTED";
  rounds: number;
  yoe?: number;
  tags?: string[];
}) {
  return prisma.interviewExperience.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      companyId: data.companyId,
      role: data.role,
      result: data.result,
      rounds: data.rounds,
      yoe: data.yoe,
      tags: data.tags || [],
      status: "DRAFT", // Needs moderation
    },
  });
}

// ─── Salary Insights ────────────────────────

export async function getCompanySalaries(companyId: string) {
  const salaries = await prisma.salaryInsight.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Aggregate by role
  const byRole = new Map<string, { baseSalary: number[]; totalComp: number[]; count: number }>();
  for (const s of salaries) {
    const key = s.role;
    if (!byRole.has(key)) byRole.set(key, { baseSalary: [], totalComp: [], count: 0 });
    const r = byRole.get(key)!;
    if (s.baseSalary) r.baseSalary.push(s.baseSalary);
    if (s.totalComp) r.totalComp.push(s.totalComp);
    r.count++;
  }

  const aggregated = Array.from(byRole.entries()).map(([role, data]) => ({
    role,
    count: data.count,
    avgBaseSalary: data.baseSalary.length > 0
      ? Math.round(data.baseSalary.reduce((a, b) => a + b, 0) / data.baseSalary.length)
      : null,
    avgTotalComp: data.totalComp.length > 0
      ? Math.round(data.totalComp.reduce((a, b) => a + b, 0) / data.totalComp.length)
      : null,
    minBase: data.baseSalary.length > 0 ? Math.min(...data.baseSalary) : null,
    maxBase: data.baseSalary.length > 0 ? Math.max(...data.baseSalary) : null,
  }));

  return { salaries: aggregated, total: salaries.length };
}

export async function submitSalary(data: {
  companyId: string;
  userId: string;
  role: string;
  level?: string;
  baseSalary?: number;
  totalComp?: number;
  currency?: string;
  location?: string;
  yoe?: number;
}) {
  return prisma.salaryInsight.create({
    data: {
      companyId: data.companyId,
      userId: data.userId,
      role: data.role,
      level: data.level,
      baseSalary: data.baseSalary,
      totalComp: data.totalComp,
      currency: data.currency || "INR",
      location: data.location,
      yoe: data.yoe,
    },
  });
}

// ─── Preparation Plans ──────────────────────

export async function getUserPrepPlan(userId: string) {
  return prisma.preparationPlan.findFirst({
    where: { userId, active: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPrepPlan(data: {
  userId: string;
  companyId?: string;
  targetRole?: string;
  durationWeeks: number;
  plan: object;
}) {
  // Deactivate existing plans
  await prisma.preparationPlan.updateMany({
    where: { userId: data.userId, active: true },
    data: { active: false },
  });

  return prisma.preparationPlan.create({
    data: {
      userId: data.userId,
      companyId: data.companyId,
      targetRole: data.targetRole,
      durationWeeks: data.durationWeeks,
      plan: data.plan as Prisma.InputJsonValue,
      active: true,
    },
  });
}
