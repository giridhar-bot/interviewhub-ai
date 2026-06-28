import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { checkUsageLimit } from "@/lib/ai";
import * as resumeService from "@/services/resume-review.service";
import { z } from "zod";

const analyzeSchema = z.object({
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  resumeText: z.string().min(50).max(50000),
  targetRole: z.string().optional(),
});

// POST /api/ai/resume — Analyze resume
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
  const parsed = analyzeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const result = await resumeService.analyzeResume(
    user.id,
    parsed.data.fileName,
    parsed.data.fileUrl,
    parsed.data.resumeText,
    parsed.data.targetRole
  );

  return NextResponse.json(result);
}

// GET /api/ai/resume — List reviews
export async function GET() {
  const user = await requireAuth();
  const reviews = await resumeService.getReviews(user.id);
  return NextResponse.json({ reviews });
}
