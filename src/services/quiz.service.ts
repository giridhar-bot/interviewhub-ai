// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Quiz Service
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getCache, setCache } from "@/lib/redis";

// ─── List Quizzes ───────────────────────────

export async function getQuizzes(options?: {
  topicId?: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  page?: number;
  limit?: number;
}) {
  const { topicId, difficulty, status = "PUBLISHED", page = 1, limit = 20 } = options || {};
  const skip = (page - 1) * limit;

  const where: Prisma.QuizWhereInput = {
    status,
    ...(topicId && { topicId }),
    ...(difficulty && { difficulty }),
  };

  const [quizzes, total] = await Promise.all([
    prisma.quiz.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        topic: { select: { id: true, name: true, slug: true } },
        _count: { select: { questions: true, attempts: true } },
      },
    }),
    prisma.quiz.count({ where }),
  ]);

  return { quizzes, total, pages: Math.ceil(total / limit), page };
}

// ─── Get Quiz with Questions ────────────────

export async function getQuiz(slug: string) {
  const cacheKey = `quiz:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchQuiz>>>(cacheKey);
  if (cached) return cached;

  const quiz = await fetchQuiz(slug);
  if (quiz) await setCache(cacheKey, quiz, 3600);
  return quiz;
}

async function fetchQuiz(slug: string) {
  return prisma.quiz.findUnique({
    where: { slug },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: { orderBy: { order: "asc" } },
        },
      },
    },
  });
}

// ─── Get Quiz for Taking (hide correct answers) ─

export async function getQuizForAttempt(slug: string) {
  const quiz = await getQuiz(slug);
  if (!quiz) return null;

  return {
    ...quiz,
    questions: quiz.questions.map((q) => ({
      ...q,
      options: q.options.map((o) => ({
        id: o.id,
        text: o.text,
        order: o.order,
        questionId: o.questionId,
      })),
    })),
  };
}

// ─── Submit Quiz Attempt ────────────────────

export async function submitQuizAttempt(
  userId: string,
  quizId: string,
  answers: Record<string, string>, // { questionId: selectedOptionId }
  timeTaken?: number
) {
  // Get correct answers
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: { options: { where: { isCorrect: true } } },
      },
    },
  });
  if (!quiz) throw new Error("Quiz not found");

  // Calculate score
  let score = 0;
  const total = quiz.questions.length;

  for (const q of quiz.questions) {
    const correctOptionIds = q.options.map((o) => o.id);
    if (correctOptionIds.includes(answers[q.id])) {
      score += q.points;
    }
  }

  // Save attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId,
      userId,
      score,
      total: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      answers: answers as unknown as Prisma.InputJsonValue,
      timeTaken,
    },
  });

  // Update quiz progress
  await prisma.quizProgress.upsert({
    where: { userId_quizId: { userId, quizId } },
    create: {
      userId,
      quizId,
      bestScore: score,
      attempts: 1,
      lastAttempt: new Date(),
    },
    update: {
      bestScore: { set: score }, // will be handled below
      attempts: { increment: 1 },
      lastAttempt: new Date(),
    },
  });

  // Update best score only if higher
  const progress = await prisma.quizProgress.findUnique({
    where: { userId_quizId: { userId, quizId } },
  });
  if (progress && score > progress.bestScore) {
    await prisma.quizProgress.update({
      where: { userId_quizId: { userId, quizId } },
      data: { bestScore: score },
    });
  }

  return attempt;
}

// ─── Get Attempt Results (with explanations) ─

export async function getAttemptResults(attemptId: string) {
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
            include: {
              options: { orderBy: { order: "asc" } },
            },
          },
        },
      },
    },
  });
  if (!attempt) throw new Error("Attempt not found");

  const answers = attempt.answers as Record<string, string>;

  return {
    ...attempt,
    quiz: {
      ...attempt.quiz,
      questions: attempt.quiz.questions.map((q) => ({
        ...q,
        selectedOptionId: answers[q.id] || null,
        isCorrect: q.options.some((o) => o.isCorrect && o.id === answers[q.id]),
      })),
    },
  };
}

// ─── User Quiz History ──────────────────────

export async function getUserQuizHistory(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      quiz: {
        select: { title: true, slug: true, topic: { select: { name: true } } },
      },
    },
  });
}

// ─── Create Quiz (admin) ────────────────────

export async function createQuiz(data: {
  title: string;
  slug: string;
  description?: string;
  topicId: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  timeLimit?: number;
  questions: {
    question: string;
    explanation?: string;
    order: number;
    points?: number;
    options: { text: string; isCorrect: boolean; order: number }[];
  }[];
  status?: "DRAFT" | "PUBLISHED";
}) {
  return prisma.quiz.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      topicId: data.topicId,
      difficulty: data.difficulty || "MEDIUM",
      timeLimit: data.timeLimit,
      status: data.status || "DRAFT",
      questions: {
        create: data.questions.map((q) => ({
          question: q.question,
          explanation: q.explanation,
          order: q.order,
          points: q.points || 1,
          options: {
            create: q.options.map((o) => ({
              text: o.text,
              isCorrect: o.isCorrect,
              order: o.order,
            })),
          },
        })),
      },
    },
    include: {
      questions: { include: { options: true }, orderBy: { order: "asc" } },
    },
  });
}

// ─── Update Quiz ────────────────────────────

export async function updateQuiz(
  id: string,
  data: {
    title?: string;
    description?: string;
    difficulty?: "EASY" | "MEDIUM" | "HARD";
    timeLimit?: number;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }
) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new Error("Quiz not found");

  const updated = await prisma.quiz.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.difficulty && { difficulty: data.difficulty }),
      ...(data.timeLimit !== undefined && { timeLimit: data.timeLimit }),
      ...(data.status && { status: data.status }),
    },
  });

  await setCache(`quiz:${updated.slug}`, null, 0);
  return updated;
}
