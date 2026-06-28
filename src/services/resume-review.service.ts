import { prisma } from "@/lib/prisma";
import { aiGenerate } from "@/lib/ai";

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
  let analysis: ResumeAnalysis;
  try {
    // Extract JSON from response (might be wrapped in markdown code block)
    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : getDefaultAnalysis();
  } catch {
    analysis = getDefaultAnalysis();
    analysis.overallFeedback = result.text;
  }

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

function getDefaultAnalysis(): ResumeAnalysis {
  return {
    atsScore: 50,
    categories: [
      { category: "format", score: 50, maxScore: 100, suggestions: ["Could not parse resume fully"] },
      { category: "keywords", score: 50, maxScore: 100, suggestions: [] },
      { category: "experience", score: 50, maxScore: 100, suggestions: [] },
      { category: "skills", score: 50, maxScore: 100, suggestions: [] },
    ],
    overallFeedback: "Analysis could not be completed fully. Please try again.",
    keywordAnalysis: { matched: [], missing: [] },
    improvements: [],
  };
}
