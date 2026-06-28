import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { checkUsageLimit } from "@/lib/ai";
import {
  generateRoadmap,
  generateStudyPlan,
  generateFlashcards,
  generateQuiz,
  getCareerAdvice,
  reviewSystemDesign,
} from "@/services/ai-modules.service";
import { z } from "zod";

const generateSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("roadmap"),
    targetRole: z.string(),
    currentSkills: z.array(z.string()),
    timelineWeeks: z.number().min(1).max(52),
    experienceLevel: z.string(),
  }),
  z.object({
    type: z.literal("studyPlan"),
    targetRole: z.string(),
    targetCompany: z.string().optional(),
    interviewDate: z.string().optional(),
    hoursPerDay: z.number().min(1).max(16),
    weakAreas: z.array(z.string()),
    strongAreas: z.array(z.string()),
  }),
  z.object({
    type: z.literal("flashcards"),
    topic: z.string(),
    count: z.number().min(1).max(30).default(10),
    difficulty: z.string().optional(),
  }),
  z.object({
    type: z.literal("quiz"),
    topic: z.string(),
    count: z.number().min(1).max(20).default(5),
    difficulty: z.string().optional(),
  }),
  z.object({
    type: z.literal("career"),
    question: z.string().min(1).max(5000),
    currentRole: z.string().optional(),
    experience: z.number().optional(),
    skills: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal("systemDesign"),
    design: z.string().min(1).max(20000),
    problem: z.string().min(1),
  }),
]);

// POST /api/ai/generate — Multi-purpose AI generation
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
  const parsed = generateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  switch (data.type) {
    case "roadmap": {
      const result = await generateRoadmap(
        user.id,
        data.targetRole,
        data.currentSkills,
        data.timelineWeeks,
        data.experienceLevel
      );
      return NextResponse.json({ text: result.text, usage: result.usage });
    }

    case "studyPlan": {
      const result = await generateStudyPlan(user.id, {
        targetRole: data.targetRole,
        targetCompany: data.targetCompany,
        interviewDate: data.interviewDate,
        hoursPerDay: data.hoursPerDay,
        weakAreas: data.weakAreas,
        strongAreas: data.strongAreas,
      });
      return NextResponse.json({
        studyPlan: result.studyPlan,
        text: result.aiResponse.text,
        usage: result.aiResponse.usage,
      });
    }

    case "flashcards": {
      const result = await generateFlashcards(user.id, data.topic, data.count, data.difficulty);
      return NextResponse.json({ text: result.text, usage: result.usage });
    }

    case "quiz": {
      const result = await generateQuiz(user.id, data.topic, data.count, data.difficulty);
      return NextResponse.json({ text: result.text, usage: result.usage });
    }

    case "career": {
      const result = await getCareerAdvice(user.id, data.question, {
        currentRole: data.currentRole,
        experience: data.experience,
        skills: data.skills,
      });
      return NextResponse.json({ text: result.text, usage: result.usage });
    }

    case "systemDesign": {
      const result = await reviewSystemDesign(user.id, data.design, data.problem);
      return NextResponse.json({ text: result.text, usage: result.usage });
    }
  }
}
