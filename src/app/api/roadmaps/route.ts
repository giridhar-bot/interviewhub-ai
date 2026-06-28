import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import {
  getRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  getRoadmapProgress,
  updateRoadmapProgress,
} from "@/services/roadmap.service";
import { z } from "zod";

const stepSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int(),
  resources: z.record(z.string(), z.unknown()).optional(),
});

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  topicId: z.string().uuid(),
  steps: z.array(stepSchema).min(1),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

const progressSchema = z.object({
  roadmapId: z.string().uuid(),
  currentStep: z.number().int().min(0),
  totalSteps: z.number().int().min(1),
});

// GET /api/roadmaps
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");

  if (slug) {
    const roadmap = await getRoadmap(slug);
    if (!roadmap) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Include user progress if authenticated
    let progress = null;
    try {
      const user = await requireAuth();
      progress = await getRoadmapProgress(user.id, roadmap.id);
    } catch {
      // Not authenticated — no progress
    }

    return NextResponse.json({ ...roadmap, userProgress: progress });
  }

  const roadmaps = await getRoadmaps({
    topicId: searchParams.get("topicId") || undefined,
  });
  return NextResponse.json(roadmaps);
}

// POST /api/roadmaps — Create or update progress
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  // Check if this is a progress update
  if (body.action === "progress") {
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const progress = await updateRoadmapProgress(
      user.id,
      parsed.data.roadmapId,
      parsed.data.currentStep,
      parsed.data.totalSteps
    );
    return NextResponse.json(progress);
  }

  // Create roadmap (admin only)
  if (!["ADMIN", "SUPER_ADMIN", "AUTHOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const roadmap = await createRoadmap(parsed.data);
  return NextResponse.json(roadmap, { status: 201 });
}

// PUT /api/roadmaps — Update roadmap
export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  if (!["ADMIN", "SUPER_ADMIN", "AUTHOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const roadmap = await updateRoadmap(id, data);
  return NextResponse.json(roadmap);
}
