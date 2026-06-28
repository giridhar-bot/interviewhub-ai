// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Coding Problem Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";
import type { Difficulty, SubmissionStatus } from "@/generated/prisma/client";

const CACHE_TTL = 300;

export const codingRepository = {
  async findProblems(filters: {
    difficulty?: Difficulty;
    category?: string;
    tag?: string;
    page?: number;
    limit?: number;
  }) {
    const { difficulty, category, tag, page = 1, limit = 20 } = filters;

    const where = {
      status: "PUBLISHED" as const,
      deletedAt: null,
      ...(difficulty ? { difficulty } : {}),
      ...(category ? { category } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    };

    const [problems, total] = await Promise.all([
      prisma.codingProblem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
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
        },
      }),
      prisma.codingProblem.count({ where }),
    ]);

    return { problems, total, page, totalPages: Math.ceil(total / limit) };
  },

  async findBySlug(slug: string) {
    const cacheKey = `problems:slug:${slug}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const problem = await prisma.codingProblem.findUnique({
      where: { slug, deletedAt: null },
      include: {
        testCases: { where: { isHidden: false }, orderBy: { order: "asc" } },
        problemTags: true,
        problemCompanies: { include: { company: { select: { name: true, slug: true } } } },
      },
    });

    if (problem) await setCache(cacheKey, problem, CACHE_TTL);
    return problem;
  },

  async submitSolution(data: {
    userId: string;
    problemId: string;
    code: string;
    language: string;
    status: SubmissionStatus;
    runtime?: number;
    memory?: number;
    testsPassed?: number;
    testsTotal?: number;
  }) {
    const submission = await prisma.submission.create({ data });

    // Update acceptance rate
    const stats = await prisma.submission.groupBy({
      by: ["status"],
      where: { problemId: data.problemId },
      _count: true,
    });
    const total = stats.reduce((s, g) => s + g._count, 0);
    const accepted = stats.find((g) => g.status === "ACCEPTED")?._count ?? 0;
    if (total > 0) {
      await prisma.codingProblem.update({
        where: { id: data.problemId },
        data: { acceptance: (accepted / total) * 100 },
      });
    }

    return submission;
  },

  async getUserSubmissions(userId: string, problemId?: string, limit = 20) {
    return prisma.submission.findMany({
      where: { userId, ...(problemId ? { problemId } : {}) },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        problem: { select: { title: true, slug: true, difficulty: true } },
      },
    });
  },
};
