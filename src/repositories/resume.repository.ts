// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Resume Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const resumeRepository = {
  async findByUserId(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.resume.findUnique({
      where: { id },
      include: {
        skills: true,
        projects: true,
        workExperiences: true,
        educations: true,
        certifications: true,
        resumeAchievements: true,
        versions: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
  },

  async create(data: {
    userId: string;
    title: string;
    template?: string;
    summary?: string;
  }) {
    return prisma.resume.create({ data });
  },

  async update(id: string, data: Partial<{ title: string; summary: string; template: string }>) {
    return prisma.resume.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.resume.delete({ where: { id } });
  },
};
