import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { aiGenerate, aiStream } from "@/lib/ai";
import type { ModelMessage } from "ai";

// ═══════════════════════════════════════════════
// AI TUTOR SERVICE
// ═══════════════════════════════════════════════

export async function createConversation(userId: string, title?: string, topicId?: string) {
  return prisma.aITutorConversation.create({
    data: { userId, title, topicId },
  });
}

export async function getConversations(userId: string, limit = 20) {
  return prisma.aITutorConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      messages: { take: 1, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getConversation(conversationId: string, userId: string) {
  return prisma.aITutorConversation.findFirst({
    where: { id: conversationId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function chat(
  userId: string,
  conversationId: string,
  userMessage: string,
  topicHint?: string
) {
  // Save user message
  await prisma.aIMessage.create({
    data: {
      conversationId,
      role: "user",
      content: userMessage,
    },
  });

  // Get conversation history
  const history = await prisma.aIMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 20, // limit context window
  });

  const messages: ModelMessage[] = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Generate response
  const result = await aiGenerate({
    module: "tutor",
    messages,
    userId,
    useRAG: true,
    ragTopicHint: topicHint,
    ragEntityTypes: ["article", "topic", "question"],
  });

  // Save assistant response
  await prisma.aIMessage.create({
    data: {
      conversationId,
      role: "assistant",
      content: result.text,
      metadata: {
        model: result.model,
        tokens: result.usage.totalTokens,
        cost: result.cost,
        sources: result.sources,
      },
    },
  });

  // Update conversation title if first message
  if (history.length <= 1) {
    await prisma.aITutorConversation.update({
      where: { id: conversationId },
      data: { title: userMessage.slice(0, 100) },
    });
  }

  return result;
}

export async function chatStream(
  userId: string,
  conversationId: string,
  userMessage: string,
  topicHint?: string
) {
  // Save user message
  await prisma.aIMessage.create({
    data: { conversationId, role: "user", content: userMessage },
  });

  // Get history
  const history = await prisma.aIMessage.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  const messages: ModelMessage[] = history.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Return stream — caller handles saving assistant response
  return aiStream({
    module: "tutor",
    messages,
    userId,
    useRAG: true,
    ragTopicHint: topicHint,
    ragEntityTypes: ["article", "topic", "question"],
  });
}

export async function saveStreamedResponse(
  conversationId: string,
  content: string,
  metadata?: Record<string, unknown>
) {
  return prisma.aIMessage.create({
    data: {
      conversationId,
      role: "assistant",
      content,
      metadata: (metadata as Prisma.InputJsonValue) || undefined,
    },
  });
}

export async function deleteConversation(conversationId: string, userId: string) {
  return prisma.aITutorConversation.deleteMany({
    where: { id: conversationId, userId },
  });
}
