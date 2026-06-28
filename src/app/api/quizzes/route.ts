import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import {
  getQuizzes,
  getQuiz,
  getQuizForAttempt,
  submitQuizAttempt,
  getAttemptResults,
  getUserQuizHistory,
  createQuiz,
} from "@/services/quiz.service";
import { awardXP, XP_VALUES, updateStreak } from "@/services/gamification.service";
import { updateLearningProgress, updateDailyGoal } from "@/services/progress.service";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitSchema = z.object({
  quizId: z.string().uuid(),
  answers: z.record(z.string(), z.string()), // { questionId: selectedOptionId }
  timeTaken: z.number().int().optional(),
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  topicId: z.string().uuid(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  timeLimit: z.number().int().optional(),
  questions: z.array(z.object({
    question: z.string().min(1),
    explanation: z.string().optional(),
    order: z.number().int(),
    points: z.number().int().optional(),
    options: z.array(z.object({
      text: z.string().min(1),
      isCorrect: z.boolean(),
      order: z.number().int(),
    })).min(2),
  })).min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

// GET /api/quizzes
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const action = searchParams.get("action");

  if (action === "attempt" && slug) {
    const quiz = await getQuizForAttempt(slug);
    if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(quiz);
  }

  if (action === "results") {
    const attemptId = searchParams.get("attemptId");
    if (!attemptId) return NextResponse.json({ error: "Missing attemptId" }, { status: 400 });
    const results = await getAttemptResults(attemptId);
    return NextResponse.json(results);
  }

  if (action === "history") {
    const user = await requireAuth();
    const history = await getUserQuizHistory(user.id);
    return NextResponse.json(history);
  }

  if (slug) {
    const quiz = await getQuiz(slug);
    if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(quiz);
  }

  const quizzes = await getQuizzes({
    topicId: searchParams.get("topicId") || undefined,
    difficulty: (searchParams.get("difficulty") as "EASY" | "MEDIUM" | "HARD") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
  });
  return NextResponse.json(quizzes);
}

// POST /api/quizzes
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  // Submit quiz attempt
  if (body.action === "submit") {
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const attempt = await submitQuizAttempt(
      user.id,
      parsed.data.quizId,
      parsed.data.answers,
      parsed.data.timeTaken
    );

    // Award XP
    const isPerfect = attempt.score === attempt.total;
    const xp = isPerfect ? XP_VALUES.quizPerfect : XP_VALUES.quizComplete;
    await awardXP(user.id, xp, "quiz", attempt.id);
    await updateStreak(user.id);

    // Get quiz topic for learning progress
    const quizRecord = await prisma.quiz.findUnique({
      where: { id: parsed.data.quizId },
      select: { topicId: true },
    });
    if (quizRecord) {
      await updateLearningProgress(user.id, quizRecord.topicId, "quizzesTaken", xp);
    }
    await updateDailyGoal(user.id, "earnedXP", xp);

    return NextResponse.json({ ...attempt, xpEarned: xp });
  }

  // Create quiz (admin only)
  if (!["ADMIN", "SUPER_ADMIN", "AUTHOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const quiz = await createQuiz(parsed.data);
  return NextResponse.json(quiz, { status: 201 });
}
