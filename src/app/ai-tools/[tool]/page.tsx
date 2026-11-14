import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolWorkspace, type Tool } from "@/features/ai/tool-workspace";
import { requireAuth } from "@/lib/auth-guard";
import { generateSEO } from "@/lib/seo";
import { z } from "zod";

const toolSchema = z.enum(["tutor", "mock-interview", "resume-review", "study-planner"]);
const tools: Record<Tool, { title: string; description: string }> = {
  tutor: {
    title: "AI Tutor",
    description: "Ask technical questions and continue the conversation with an AI tutor.",
  },
  "mock-interview": {
    title: "AI Mock Interview",
    description: "Practice eight interview questions with feedback on your answers.",
  },
  "resume-review": {
    title: "AI Resume Review",
    description: "Review your resume text for keywords, clarity and suggested improvements.",
  },
  "study-planner": {
    title: "AI Study Planner",
    description: "Generate a study plan tailored to your role, skills and available time.",
  },
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const parsed = toolSchema.safeParse((await params).tool);
  if (!parsed.success) return {};
  return generateSEO({ ...tools[parsed.data], path: `/ai-tools/${parsed.data}`, noIndex: true });
}

export default async function AIToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const parsed = toolSchema.safeParse((await params).tool);
  if (!parsed.success) notFound();
  await requireAuth();
  const tool = tools[parsed.data];
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/ai-tools" className="text-sm text-primary hover:underline">
        Back to AI tools
      </Link>
      <h1 className="mt-4 text-3xl font-bold">{tool.title}</h1>
      <p className="mb-8 mt-2 text-muted-foreground">
        {tool.description} AI usage is subject to your daily plan limit.
      </p>
      <ToolWorkspace tool={parsed.data} />
    </div>
  );
}
