import { prisma } from "@/lib/prisma";
import { aiGenerate, aiStream } from "@/lib/ai";

// ═══════════════════════════════════════════════
// AI CODE REVIEW SERVICE
// ═══════════════════════════════════════════════

export async function reviewCode(
  userId: string,
  code: string,
  language: string,
  context?: string
) {
  return aiGenerate({
    module: "codeReview",
    messages: [
      {
        role: "user",
        content: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`${context ? `\n\nContext: ${context}` : ""}`,
      },
    ],
    userId,
    tier: "balanced",
    maxTokens: 2500,
    temperature: 0.3,
  });
}

export async function explainCode(
  userId: string,
  code: string,
  language: string
) {
  return aiGenerate({
    module: "codeExplainer",
    messages: [
      {
        role: "user",
        content: `Explain this ${language} code step by step:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
    userId,
    tier: "fast",
    maxTokens: 2000,
  });
}

export async function streamCodeReview(
  userId: string,
  code: string,
  language: string
) {
  return aiStream({
    module: "codeReview",
    messages: [
      {
        role: "user",
        content: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      },
    ],
    userId,
    tier: "balanced",
  });
}

// ═══════════════════════════════════════════════
// AI ROADMAP GENERATOR
// ═══════════════════════════════════════════════

export async function generateRoadmap(
  userId: string,
  targetRole: string,
  currentSkills: string[],
  timelineWeeks: number,
  experienceLevel: string
) {
  const result = await aiGenerate({
    module: "roadmapGenerator",
    messages: [
      {
        role: "user",
        content: `Generate a learning roadmap:
- Target Role: ${targetRole}
- Current Skills: ${currentSkills.join(", ")}
- Timeline: ${timelineWeeks} weeks
- Experience Level: ${experienceLevel}

Return as JSON: { "title": string, "phases": [{ "name": string, "weeks": [number, number], "topics": [{ "name": string, "resources": string[], "milestone": string }] }] }`,
      },
    ],
    userId,
    tier: "balanced",
    maxTokens: 3000,
    temperature: 0.5,
  });

  return result;
}

// ═══════════════════════════════════════════════
// AI STUDY PLANNER
// ═══════════════════════════════════════════════

export async function generateStudyPlan(
  userId: string,
  options: {
    targetRole: string;
    targetCompany?: string;
    interviewDate?: string;
    hoursPerDay: number;
    weakAreas: string[];
    strongAreas: string[];
  }
) {
  const result = await aiGenerate({
    module: "studyPlanner",
    messages: [
      {
        role: "user",
        content: `Create a personalized study plan:
- Target Role: ${options.targetRole}
${options.targetCompany ? `- Target Company: ${options.targetCompany}` : ""}
${options.interviewDate ? `- Interview Date: ${options.interviewDate}` : ""}
- Available Hours/Day: ${options.hoursPerDay}
- Weak Areas: ${options.weakAreas.join(", ")}
- Strong Areas: ${options.strongAreas.join(", ")}

Return as JSON: { "title": string, "totalDays": number, "plan": [{ "day": number, "topics": [{ "name": string, "duration": string, "type": "study|practice|review" }], "problems": string[], "notes": string }] }`,
      },
    ],
    userId,
    tier: "balanced",
    maxTokens: 4000,
    temperature: 0.5,
  });

  // Save study plan
  let planData;
  try {
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    planData = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: result.text };
  } catch {
    planData = { raw: result.text };
  }

  const studyPlan = await prisma.studyPlan.create({
    data: {
      userId,
      title: planData.title || `Study Plan for ${options.targetRole}`,
      targetRole: options.targetRole,
      targetCompany: options.targetCompany,
      timeline: planData.totalDays,
      plan: planData,
    },
  });

  return { studyPlan, aiResponse: result };
}

export async function getUserStudyPlans(userId: string) {
  return prisma.studyPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

// ═══════════════════════════════════════════════
// AI FLASHCARD GENERATOR
// ═══════════════════════════════════════════════

export async function generateFlashcards(
  userId: string,
  topic: string,
  count = 10,
  difficulty?: string
) {
  return aiGenerate({
    module: "flashcardGenerator",
    messages: [
      {
        role: "user",
        content: `Generate ${count} flashcards for "${topic}"${difficulty ? ` at ${difficulty} level` : ""}. Return as JSON array.`,
      },
    ],
    userId,
    useRAG: true,
    ragTopicHint: topic,
    tier: "fast",
    maxTokens: 3000,
    temperature: 0.7,
  });
}

// ═══════════════════════════════════════════════
// AI QUIZ GENERATOR
// ═══════════════════════════════════════════════

export async function generateQuiz(
  userId: string,
  topic: string,
  count = 5,
  difficulty?: string
) {
  return aiGenerate({
    module: "quizGenerator",
    messages: [
      {
        role: "user",
        content: `Generate ${count} MCQ questions for "${topic}"${difficulty ? ` at ${difficulty} level` : ""}. Return as JSON array.`,
      },
    ],
    userId,
    useRAG: true,
    ragTopicHint: topic,
    tier: "fast",
    maxTokens: 3000,
    temperature: 0.7,
  });
}

// ═══════════════════════════════════════════════
// AI CAREER ADVISOR
// ═══════════════════════════════════════════════

export async function getCareerAdvice(
  userId: string,
  question: string,
  context?: { currentRole?: string; experience?: number; skills?: string[] }
) {
  const contextStr = context
    ? `\nCandidate Info:\n- Current Role: ${context.currentRole || "N/A"}\n- Experience: ${context.experience || "N/A"} years\n- Skills: ${context.skills?.join(", ") || "N/A"}`
    : "";

  return aiGenerate({
    module: "careerAdvisor",
    messages: [{ role: "user", content: `${question}${contextStr}` }],
    userId,
    tier: "balanced",
    maxTokens: 2000,
  });
}

// ═══════════════════════════════════════════════
// AI SYSTEM DESIGN REVIEWER
// ═══════════════════════════════════════════════

export async function reviewSystemDesign(
  userId: string,
  design: string,
  problem: string
) {
  return aiGenerate({
    module: "systemDesignReviewer",
    messages: [
      {
        role: "user",
        content: `Problem: ${problem}\n\nProposed Design:\n${design}\n\nReview this system design.`,
      },
    ],
    userId,
    tier: "premium",
    maxTokens: 3000,
    temperature: 0.4,
  });
}
