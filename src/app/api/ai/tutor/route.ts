import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { checkUsageLimit } from "@/lib/ai";
import * as tutorService from "@/services/ai-tutor.service";
import { z } from "zod";

const chatSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1).max(10000),
  topicHint: z.string().optional(),
});

// POST /api/ai/tutor — Send message (streaming)
export async function POST(request: NextRequest) {
  const user = await requireAuth();

  // Check usage limits
  const plan = (user.plan as "FREE" | "PRO" | "ENTERPRISE") || "FREE";
  const limit = await checkUsageLimit(user.id, plan);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Daily AI usage limit reached", remaining: 0, limit: limit.limit },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { message, topicHint } = parsed.data;
  let { conversationId } = parsed.data;

  // Create conversation if not provided
  if (!conversationId) {
    const conv = await tutorService.createConversation(user.id, undefined, undefined);
    conversationId = conv.id;
  }

  // Stream response
  const stream = await tutorService.chatStream(user.id, conversationId, message, topicHint);
  return stream.toTextStreamResponse();
}

// GET /api/ai/tutor — List conversations
export async function GET() {
  const user = await requireAuth();
  const conversations = await tutorService.getConversations(user.id);
  return NextResponse.json({ conversations });
}
