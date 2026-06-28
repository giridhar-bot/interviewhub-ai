import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { checkUsageLimit } from "@/lib/ai";
import { reviewCode, explainCode } from "@/services/ai-modules.service";
import { z } from "zod";

const codeSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.string().min(1),
  action: z.enum(["review", "explain"]).default("review"),
  context: z.string().optional(),
});

// POST /api/ai/code-review
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
  const parsed = codeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { code, language, action, context } = parsed.data;

  const result = action === "explain"
    ? await explainCode(user.id, code, language)
    : await reviewCode(user.id, code, language, context);

  return NextResponse.json({
    text: result.text,
    usage: result.usage,
    model: result.model,
  });
}
