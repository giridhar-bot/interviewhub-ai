// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Coding Platform Service
// Problems, Submissions, Contests, Judge Abstraction
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getCache, setCache } from "@/lib/redis";

// ─── Problems ───────────────────────────────

export async function getProblems(options?: {
  category?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  companyId?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { category, difficulty, companyId, tag, search, page = 1, limit = 20 } = options || {};
  const skip = (page - 1) * limit;

  const where: Prisma.CodingProblemWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    ...(category && { category }),
    ...(difficulty && { difficulty }),
    ...(tag && { problemTags: { some: { tag } } }),
    ...(companyId && { problemCompanies: { some: { companyId } } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [problems, total] = await Promise.all([
    prisma.codingProblem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        category: true,
        tags: true,
        acceptance: true,
        _count: { select: { submissions: true } },
        problemCompanies: {
          include: { company: { select: { name: true, slug: true } } },
          take: 3,
        },
      },
    }),
    prisma.codingProblem.count({ where }),
  ]);

  return { problems, total, pages: Math.ceil(total / limit), page };
}

export async function getProblem(slug: string) {
  const cacheKey = `problem:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchProblem>>>(cacheKey);
  if (cached) return cached;

  const problem = await fetchProblem(slug);
  if (problem) await setCache(cacheKey, problem, 3600);
  return problem;
}

async function fetchProblem(slug: string) {
  return prisma.codingProblem.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      testCases: { where: { isHidden: false }, orderBy: { order: "asc" } },
      problemTags: true,
      problemCompanies: {
        include: { company: { select: { name: true, slug: true } } },
      },
    },
  });
}

// ─── Languages ──────────────────────────────

export async function getLanguages() {
  return prisma.language.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

// ─── Submissions ────────────────────────────

export async function createSubmission(data: {
  userId: string;
  problemId: string;
  code: string;
  language: string;
}) {
  // In production, this would go through a judge queue
  // For now, create a pending submission
  return prisma.submission.create({
    data: {
      userId: data.userId,
      problemId: data.problemId,
      code: data.code,
      language: data.language,
      status: "PENDING",
    },
  });
}

export async function updateSubmissionResult(
  id: string,
  result: {
    status: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT" | "MEMORY_LIMIT" | "RUNTIME_ERROR" | "COMPILE_ERROR";
    runtime?: number;
    memory?: number;
    testsPassed?: number;
    testsTotal?: number;
  }
) {
  return prisma.submission.update({
    where: { id },
    data: result,
  });
}

export async function getUserSubmissions(userId: string, problemId?: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return prisma.submission.findMany({
    where: { userId, ...(problemId && { problemId }) },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      problem: { select: { title: true, slug: true, difficulty: true } },
    },
  });
}

// ─── User Problem Stats ─────────────────────

export async function getUserCodingStats(userId: string) {
  const [total, accepted, byDifficulty] = await Promise.all([
    prisma.submission.count({ where: { userId } }),
    prisma.submission.groupBy({
      by: ["problemId"],
      where: { userId, status: "ACCEPTED" },
    }),
    prisma.codingProgress.findMany({
      where: { userId, solved: true },
      include: {
        // We'll get the difficulty from a separate query
      },
    }),
  ]);

  const solvedProblemIds = accepted.map((a) => a.problemId);
  const difficultyBreakdown = await prisma.codingProblem.groupBy({
    by: ["difficulty"],
    where: { id: { in: solvedProblemIds } },
    _count: true,
  });

  return {
    totalSubmissions: total,
    problemsSolved: solvedProblemIds.length,
    difficulty: {
      easy: difficultyBreakdown.find((d) => d.difficulty === "EASY")?._count || 0,
      medium: difficultyBreakdown.find((d) => d.difficulty === "MEDIUM")?._count || 0,
      hard: difficultyBreakdown.find((d) => d.difficulty === "HARD")?._count || 0,
    },
  };
}

// ─── Contests ───────────────────────────────

export async function getContests(status?: "upcoming" | "active" | "past") {
  const now = new Date();
  const where: Prisma.ContestWhereInput = {
    status: "PUBLISHED",
  };

  if (status === "upcoming") {
    where.startTime = { gt: now };
  } else if (status === "active") {
    where.startTime = { lte: now };
    where.endTime = { gt: now };
  } else if (status === "past") {
    where.endTime = { lte: now };
  }

  return prisma.contest.findMany({
    where,
    orderBy: { startTime: "desc" },
    include: {
      _count: { select: { problems: true, submissions: true } },
    },
  });
}

export async function getContest(slug: string) {
  return prisma.contest.findUnique({
    where: { slug },
    include: {
      problems: {
        orderBy: { order: "asc" },
        include: {
          problem: {
            select: { title: true, slug: true, difficulty: true },
          },
        },
      },
      leaderboard: {
        orderBy: { rank: "asc" },
        take: 50,
      },
    },
  });
}

export async function getContestLeaderboard(contestId: string) {
  return prisma.leaderboard.findMany({
    where: { contestId },
    orderBy: { rank: "asc" },
    take: 100,
  });
}

// ─── Problem Categories ─────────────────────

export async function getProblemCategories() {
  const categories = await prisma.codingProblem.groupBy({
    by: ["category"],
    where: { status: "PUBLISHED", deletedAt: null },
    _count: true,
    orderBy: { _count: { category: "desc" } },
  });
  return categories.map((c) => ({ name: c.category, count: c._count }));
}

// ─── Problem Tags ───────────────────────────

export async function getProblemTags() {
  const tags = await prisma.problemTag.groupBy({
    by: ["tag"],
    _count: true,
    orderBy: { _count: { tag: "desc" } },
    take: 50,
  });
  return tags.map((t) => ({ name: t.tag, count: t._count }));
}

// ─── Company Problems ───────────────────────

export async function getCompanyProblems(companyId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [problems, total] = await Promise.all([
    prisma.problemCompany.findMany({
      where: { companyId },
      orderBy: { frequency: "desc" },
      skip,
      take: limit,
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            category: true,
            acceptance: true,
          },
        },
      },
    }),
    prisma.problemCompany.count({ where: { companyId } }),
  ]);

  return { problems: problems.map((p) => ({ ...p.problem, frequency: p.frequency })), total, pages: Math.ceil(total / limit) };
}
