import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { checkUsageLimit } from "@/lib/ai";
import * as interviewService from "@/services/mock-interview.service";
import { z } from "zod";

const createSchema = z.object({
  type: z.enum(["technical", "behavioral", "system_design", "hr", "coding"]),
  companyId: z.string().uuid().optional(),
  role: z.string().optional(),
  topicHint: z.string().optional(),
});

const answerSchema = z.object({
  interviewId: z.string().uuid(),
  answer: z.string().min(1).max(10000),
});

// POST /api/ai/interview — Create or answer
export async function POST(request: NextRequest) {
  const user = await requireAuth();

  const plan = (user.plan as "FREE" | "PRO" | "ENTERPRISE") || "FREE";
  const limit = await checkUsageLimit(user.id, plan);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily AI usage limit reached" },
      { status: 429 }
    );
  }

  const body = await request.json();

  // If interviewId is present, it's an answer
  if (body.interviewId) {
    const parsed = answerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const result = await interviewService.answerQuestion(
      user.id,
      parsed.data.interviewId,
      parsed.data.answer
    );

    return NextResponse.json(result);
  }

  // Otherwise, create new interview
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const result = await interviewService.createInterview(user.id, parsed.data.type, {
    companyId: parsed.data.companyId,
    role: parsed.data.role,
    topicHint: parsed.data.topicHint,
  });

  return NextResponse.json(result);
}

// GET /api/ai/interview — List user interviews
export async function GET() {
  const user = await requireAuth();
  const interviews = await interviewService.getUserInterviews(user.id);
  return NextResponse.json({ interviews });
}
