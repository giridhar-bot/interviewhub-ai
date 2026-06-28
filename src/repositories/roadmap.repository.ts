// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Roadmap Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const roadmapRepository = {
  async findAll() {
    return prisma.roadmap.findMany({
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { steps: true } } },
    });
  },

  async findBySlug(slug: string) {
    return prisma.roadmap.findUnique({
      where: { slug },
      include: {
        steps: { orderBy: { order: "asc" }, include: { topic: true } },
      },
    });
  },

  async getUserProgress(userId: string, roadmapId: string) {
    return prisma.roadmapProgress.findUnique({
      where: { userId_roadmapId: { userId, roadmapId } },
    });
  },
};
