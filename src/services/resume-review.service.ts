import { prisma } from "@/lib/prisma";
import { aiGenerate } from "@/lib/ai";
import { z } from "zod";

// ═══════════════════════════════════════════════
// AI RESUME REVIEW SERVICE
// ═══════════════════════════════════════════════

interface ResumeAnalysis {
  atsScore: number;
  categories: {
    category: string;
    score: number;
    maxScore: number;
    suggestions: string[];
  }[];
  overallFeedback: string;
  keywordAnalysis: {
    matched: string[];
    missing: string[];
  };
  improvements: string[];
}

const resumeAnalysisSchema = z.object({
  atsScore: z.number().min(0).max(100),
  categories: z.array(z.object({
    category: z.string(),
    score: z.number().min(0),
    maxScore: z.number().positive(),
    suggestions: z.array(z.string()),
  })),
  overallFeedback: z.string(),
  keywordAnalysis: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
  }),
  improvements: z.array(z.string()),
});

export async function analyzeResume(
  userId: string,
  fileName: string,
  fileUrl: string,
  resumeText: string,
  targetRole?: string
): Promise<{ review: { id: string }; analysis: ResumeAnalysis }> {
  const additionalContext = targetRole
    ? `The candidate is targeting a ${targetRole} position. Evaluate keywords and skills accordingly.`
    : "";

  const result = await aiGenerate({
    module: "resumeATS",
    messages: [
      {
        role: "user",
        content: `Analyze this resume and return a JSON response:\n\n${resumeText}\n\n${additionalContext}\n\nReturn JSON with: { "atsScore": number, "categories": [{ "category": string, "score": number, "maxScore": 100, "suggestions": string[] }], "overallFeedback": string, "keywordAnalysis": { "matched": string[], "missing": string[] }, "improvements": string[] }`,
      },
    ],
    userId,
    tier: "premium",
    maxTokens: 3000,
    temperature: 0.3,
  });

  // Parse AI response
  const jsonMatch = result.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Resume analysis returned no structured result");

  let parsedAnalysis: unknown;
  try {
    parsedAnalysis = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Resume analysis returned invalid structured data");
  }

  const validation = resumeAnalysisSchema.safeParse(parsedAnalysis);
  if (!validation.success) throw new Error("Resume analysis returned an invalid result");
  const analysis: ResumeAnalysis = validation.data;

  // Save review
  const review = await prisma.resumeReview.create({
    data: {
      userId,
      fileName,
      fileUrl,
      atsScore: analysis.atsScore,
      feedback: { overall: analysis.overallFeedback, improvements: analysis.improvements },
      suggestions: { keywords: analysis.keywordAnalysis },
      parsedData: { targetRole },
    },
  });

  // Save ATS scores
  for (const cat of analysis.categories) {
    await prisma.aTSScore.create({
      data: {
        reviewId: review.id,
        category: cat.category,
        score: cat.score,
        maxScore: cat.maxScore,
        suggestions: cat.suggestions,
      },
    });
  }

  return { review, analysis };
}

export async function getReviews(userId: string, limit = 10) {
  return prisma.resumeReview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { atsScores: true },
  });
}

export async function getReview(userId: string, reviewId: string) {
  return prisma.resumeReview.findFirst({
    where: { id: reviewId, userId },
    include: { atsScores: true },
  });
}
