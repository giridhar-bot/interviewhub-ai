// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Roadmap Service
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getCache, setCache, deleteCache } from "@/lib/redis";

// ─── List Roadmaps ──────────────────────────

export async function getRoadmaps(options?: {
  topicId?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const where: Prisma.RoadmapWhereInput = {
    status: options?.status || "PUBLISHED",
    deletedAt: null,
    ...(options?.topicId && { topicId: options.topicId }),
  };

  return prisma.roadmap.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      steps: { orderBy: { order: "asc" } },
      _count: { select: { progress: true } },
    },
  });
}

// ─── Get Roadmap by Slug ────────────────────

export async function getRoadmap(slug: string) {
  const cacheKey = `roadmap:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchRoadmap>>>(cacheKey);
  if (cached) return cached;

  const roadmap = await fetchRoadmap(slug);
  if (roadmap) await setCache(cacheKey, roadmap, 3600);
  return roadmap;
}

async function fetchRoadmap(slug: string) {
  return prisma.roadmap.findUnique({
    where: { slug },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      steps: { orderBy: { order: "asc" } },
    },
  });
}

// ─── Create Roadmap ─────────────────────────

export async function createRoadmap(data: {
  title: string;
  slug: string;
  description?: string;
  topicId: string;
  steps: { title: string; description?: string; order: number; resources?: object }[];
  status?: "DRAFT" | "PUBLISHED";
}) {
  return prisma.roadmap.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      topicId: data.topicId,
      status: data.status || "DRAFT",
      steps: {
        create: data.steps.map((s) => ({
          title: s.title,
          description: s.description,
          order: s.order,
          resources: s.resources as Prisma.InputJsonValue,
        })),
      },
    },
    include: { steps: { orderBy: { order: "asc" } } },
  });
}

// ─── Update Roadmap ─────────────────────────

export async function updateRoadmap(
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    steps?: { id?: string; title: string; description?: string; order: number; resources?: object }[];
  }
) {
  const roadmap = await prisma.roadmap.findUnique({ where: { id } });
  if (!roadmap) throw new Error("Roadmap not found");

  // Update steps if provided
  if (data.steps) {
    await prisma.roadmapStep.deleteMany({ where: { roadmapId: id } });
    await prisma.roadmapStep.createMany({
      data: data.steps.map((s) => ({
        roadmapId: id,
        title: s.title,
        description: s.description,
        order: s.order,
        resources: s.resources as Prisma.InputJsonValue,
      })),
    });
  }

  const updated = await prisma.roadmap.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
    },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  await deleteCache(`roadmap:${roadmap.slug}`);
  return updated;
}

// ─── User Roadmap Progress ──────────────────

export async function getRoadmapProgress(userId: string, roadmapId: string) {
  return prisma.roadmapProgress.findUnique({
    where: { userId_roadmapId: { userId, roadmapId } },
  });
}

export async function updateRoadmapProgress(
  userId: string,
  roadmapId: string,
  currentStep: number,
  totalSteps: number
) {
  const completed = currentStep >= totalSteps;
  return prisma.roadmapProgress.upsert({
    where: { userId_roadmapId: { userId, roadmapId } },
    create: { userId, roadmapId, currentStep, completed },
    update: { currentStep, completed },
  });
}

// ─── Delete Roadmap (soft) ──────────────────

export async function deleteRoadmap(id: string) {
  const roadmap = await prisma.roadmap.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  await deleteCache(`roadmap:${roadmap.slug}`);
  return roadmap;
}
