// ══════════════════════════════════════════════════════════════
// InterviewHub AI — HR & Behavioral Interview Service
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// ─── HR Question Bank ───────────────────────

export async function getHRQuestions(options?: {
  companyId?: string;
  category?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  page?: number;
  limit?: number;
}) {
  const { companyId, difficulty, page = 1, limit = 20 } = options || {};
  const skip = (page - 1) * limit;

  const where: Prisma.QuestionWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    type: { in: ["BEHAVIORAL", "HR"] },
    ...(companyId && { companyId }),
    ...(difficulty && { difficulty }),
  };

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { views: "desc" },
      skip,
      take: limit,
      include: {
        topic: { select: { name: true, slug: true } },
        company: { select: { name: true, slug: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return { questions, total, pages: Math.ceil(total / limit) };
}

// ─── System Design Questions ────────────────

export async function getSystemDesignQuestions(options?: {
  companyId?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  page?: number;
  limit?: number;
}) {
  const { companyId, difficulty, page = 1, limit = 20 } = options || {};
  const skip = (page - 1) * limit;

  const where: Prisma.QuestionWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    type: "SYSTEM_DESIGN",
    ...(companyId && { companyId }),
    ...(difficulty && { difficulty }),
  };

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy: { views: "desc" },
      skip,
      take: limit,
      include: {
        topic: { select: { name: true, slug: true } },
        company: { select: { name: true, slug: true } },
      },
    }),
    prisma.question.count({ where }),
  ]);

  return { questions, total, pages: Math.ceil(total / limit) };
}

// ─── Question Detail ────────────────────────

export async function getQuestion(slug: string) {
  const question = await prisma.question.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      topic: { select: { name: true, slug: true } },
      company: { select: { name: true, slug: true } },
    },
  });

  if (question) {
    await prisma.question.update({
      where: { id: question.id },
      data: { views: { increment: 1 } },
    });
  }

  return question;
}

// ─── HR Question Categories ─────────────────

export const HR_CATEGORIES = [
  "Tell me about yourself",
  "Why this company",
  "Strengths & Weaknesses",
  "Conflict Resolution",
  "Leadership",
  "Failure & Learning",
  "Career Goals",
  "Teamwork",
  "Time Management",
  "Pressure Handling",
  "Job Switch Reason",
  "Salary Expectations",
] as const;

// ─── Behavioral Frameworks ──────────────────

export const BEHAVIORAL_FRAMEWORKS = {
  STAR: {
    name: "STAR Method",
    steps: ["Situation", "Task", "Action", "Result"],
    description: "Most common framework for behavioral answers.",
  },
  CAR: {
    name: "CAR Method",
    steps: ["Challenge", "Action", "Result"],
    description: "Shorter format for concise answers.",
  },
  SOAR: {
    name: "SOAR Method",
    steps: ["Situation", "Obstacle", "Action", "Result"],
    description: "Emphasizes challenges overcome.",
  },
} as const;
