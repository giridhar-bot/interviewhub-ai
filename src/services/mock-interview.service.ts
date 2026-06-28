import { prisma } from "@/lib/prisma";
import { aiGenerate, aiStream } from "@/lib/ai";
import { PROMPTS, buildPrompt } from "@/lib/ai";
import type { ModelMessage } from "ai";

// ═══════════════════════════════════════════════
// AI MOCK INTERVIEW SERVICE
// ═══════════════════════════════════════════════

type InterviewType = "technical" | "behavioral" | "system_design" | "hr" | "coding";

export async function createInterview(
  userId: string,
  type: InterviewType,
  options?: { companyId?: string; role?: string; topicHint?: string }
) {
  const interview = await prisma.mockInterview.create({
    data: {
      userId,
      type,
      companyId: options?.companyId,
      role: options?.role,
    },
  });

  // Generate first question
  const systemPrompt = getInterviewPrompt(type);
  const contextMessage = options?.role
    ? `The candidate is interviewing for a ${options.role} position.`
    : "";
  const topicMessage = options?.topicHint
    ? `Focus on ${options.topicHint} related questions.`
    : "";

  const result = await aiGenerate({
    module: "mockInterview",
    messages: [
      {
        role: "user",
        content: `Start the interview.${contextMessage ? " " + contextMessage : ""}${topicMessage ? " " + topicMessage : ""} Ask your first question.`,
      },
    ],
    userId,
    additionalInstructions: buildPrompt(systemPrompt),
    tier: "premium",
  });

  // Save first question
  await prisma.interviewQuestionAI.create({
    data: {
      interviewId: interview.id,
      question: result.text,
      order: 1,
    },
  });

  return { interview, firstQuestion: result.text };
}

export async function answerQuestion(
  userId: string,
  interviewId: string,
  answer: string
) {
  const interview = await prisma.mockInterview.findFirst({
    where: { id: interviewId, userId },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });

  if (!interview) throw new Error("Interview not found");

  const lastQuestion = interview.questions[interview.questions.length - 1];
  if (!lastQuestion) throw new Error("No question to answer");

  // Update with user's answer
  await prisma.interviewQuestionAI.update({
    where: { id: lastQuestion.id },
    data: { userAnswer: answer },
  });

  // Build conversation history
  const messages: ModelMessage[] = [];
  for (const q of interview.questions) {
    messages.push({ role: "assistant", content: q.question });
    if (q.userAnswer) {
      messages.push({ role: "user", content: q.userAnswer });
    }
  }
  messages.push({ role: "user", content: answer });

  // Get feedback + next question
  const result = await aiGenerate({
    module: "mockInterview",
    messages,
    userId,
    additionalInstructions:
      "Evaluate the answer (score 1-10, feedback), then ask the next question. If this is the 5th+ question, wrap up with a summary.",
    tier: "premium",
  });

  // Parse feedback and next question
  const questionNumber = interview.questions.length + 1;

  // Update current question with feedback
  await prisma.interviewQuestionAI.update({
    where: { id: lastQuestion.id },
    data: { feedback: result.text },
  });

  // Save next question if interview continues
  if (questionNumber <= 8) {
    await prisma.interviewQuestionAI.create({
      data: {
        interviewId,
        question: result.text,
        order: questionNumber,
      },
    });
  }

  return { feedback: result.text, questionNumber, isComplete: questionNumber > 8 };
}

export async function completeInterview(userId: string, interviewId: string) {
  const interview = await prisma.mockInterview.findFirst({
    where: { id: interviewId, userId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!interview) throw new Error("Interview not found");

  // Generate overall feedback
  const summary = interview.questions
    .map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${q.userAnswer || "No answer"}\nFeedback: ${q.feedback || ""}`)
    .join("\n\n");

  const result = await aiGenerate({
    module: "mockInterview",
    messages: [
      {
        role: "user",
        content: `Here is the complete interview transcript. Provide an overall assessment with scores.\n\n${summary}`,
      },
    ],
    userId,
    additionalInstructions: `Provide overall scores for:
- Technical Knowledge (1-10)
- Communication (1-10)
- Problem Solving (1-10)
- Overall (1-10)
And a summary of strengths, weaknesses, and recommendations.`,
    tier: "premium",
  });

  // Save feedback categories
  const categories = ["communication", "technical", "problem_solving"];
  for (const category of categories) {
    await prisma.interviewFeedback.create({
      data: {
        interviewId,
        category,
        score: 7, // default — would parse from AI response in production
        feedback: result.text,
      },
    });
  }

  // Mark interview complete
  await prisma.mockInterview.update({
    where: { id: interviewId },
    data: {
      completedAt: new Date(),
      feedback: { summary: result.text },
    },
  });

  return { summary: result.text };
}

export async function getInterview(userId: string, interviewId: string) {
  return prisma.mockInterview.findFirst({
    where: { id: interviewId, userId },
    include: {
      questions: { orderBy: { order: "asc" } },
      feedbacks: true,
    },
  });
}

export async function getUserInterviews(userId: string, limit = 20) {
  return prisma.mockInterview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      type: true,
      role: true,
      score: true,
      completedAt: true,
      createdAt: true,
    },
  });
}

// ─── Stream interview for real-time ──────────

export async function streamAnswer(
  userId: string,
  interviewId: string,
  answer: string
) {
  const interview = await prisma.mockInterview.findFirst({
    where: { id: interviewId, userId },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  if (!interview) throw new Error("Interview not found");

  const messages: ModelMessage[] = [];
  for (const q of interview.questions) {
    messages.push({ role: "assistant", content: q.question });
    if (q.userAnswer) {
      messages.push({ role: "user", content: q.userAnswer });
    }
  }
  messages.push({ role: "user", content: answer });

  return aiStream({
    module: "mockInterview",
    messages,
    userId,
    tier: "premium",
  });
}

function getInterviewPrompt(type: InterviewType): string {
  switch (type) {
    case "behavioral":
    case "hr":
      return PROMPTS.mockInterview.behavioral.system;
    case "system_design":
      return PROMPTS.mockInterview.systemDesign.system;
    default:
      return PROMPTS.mockInterview.technical.system;
  }
}
