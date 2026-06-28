import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth } from "@/lib/auth-guard";
import {
  getProblems,
  getProblem,
  getLanguages,
  getProblemCategories,
  getProblemTags,
  createSubmission,
  getUserSubmissions,
  getUserCodingStats,
} from "@/services/coding.service";
import { awardXP, XP_VALUES, updateStreak } from "@/services/gamification.service";
import { updateLearningProgress, updateDailyGoal } from "@/services/progress.service";
import { z } from "zod";

const submitSchema = z.object({
  problemId: z.string().uuid(),
  code: z.string().min(1).max(100000),
  language: z.string().min(1),
});

// GET /api/coding
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  switch (action) {
    case "problem": {
      const slug = searchParams.get("slug");
      if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
      const problem = await getProblem(slug);
      if (!problem) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(problem);
    }
    case "languages":
      return NextResponse.json(await getLanguages());
    case "categories":
      return NextResponse.json(await getProblemCategories());
    case "tags":
      return NextResponse.json(await getProblemTags());
    case "submissions": {
      const user = await requireAuth();
      const problemId = searchParams.get("problemId") || undefined;
      const subs = await getUserSubmissions(user.id, problemId);
      return NextResponse.json(subs);
    }
    case "stats": {
      const user = await requireAuth();
      return NextResponse.json(await getUserCodingStats(user.id));
    }
    default: {
      const problems = await getProblems({
        category: searchParams.get("category") || undefined,
        difficulty: (searchParams.get("difficulty") as "EASY" | "MEDIUM" | "HARD") || undefined,
        companyId: searchParams.get("companyId") || undefined,
        tag: searchParams.get("tag") || undefined,
        search: searchParams.get("search") || undefined,
        page: Number(searchParams.get("page")) || 1,
        limit: Number(searchParams.get("limit")) || 20,
      });
      return NextResponse.json(problems);
    }
  }
}

// POST /api/coding — Submit solution
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const submission = await createSubmission({
    userId: user.id,
    ...parsed.data,
  });

  // Award XP for first submission per problem
  await awardXP(user.id, XP_VALUES.firstSubmission, "submission", submission.id);
  await updateStreak(user.id);
  await updateDailyGoal(user.id, "problemsSolved", 1);
  await updateDailyGoal(user.id, "earnedXP", XP_VALUES.firstSubmission);

  return NextResponse.json(submission, { status: 201 });
}
