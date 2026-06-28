// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Resume Builder Service
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// ─── Resume CRUD ────────────────────────────

export async function getUserResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { skills: true, projects: true, workExperiences: true, educations: true },
      },
    },
  });
}

export async function getResume(id: string, userId: string) {
  return prisma.resume.findFirst({
    where: { id, userId },
    include: {
      skills: { orderBy: { order: "asc" } },
      projects: { orderBy: { order: "asc" } },
      workExperiences: { orderBy: { order: "asc" } },
      educations: { orderBy: { order: "asc" } },
      certifications: { orderBy: { order: "asc" } },
      resumeAchievements: { orderBy: { order: "asc" } },
      versions: { orderBy: { version: "desc" }, take: 5 },
    },
  });
}

export async function createResume(userId: string, data: { title: string; template?: string; summary?: string }) {
  return prisma.resume.create({
    data: {
      userId,
      title: data.title,
      template: data.template || "modern",
      summary: data.summary,
    },
  });
}

export async function updateResume(
  id: string,
  userId: string,
  data: { title?: string; template?: string; summary?: string; isPublic?: boolean }
) {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) throw new Error("Resume not found");

  return prisma.resume.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.template && { template: data.template }),
      ...(data.summary !== undefined && { summary: data.summary }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
    },
  });
}

export async function deleteResume(id: string, userId: string) {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) throw new Error("Resume not found");
  return prisma.resume.delete({ where: { id } });
}

// ─── Resume Sections ────────────────────────

export async function addSkill(resumeId: string, data: { name: string; level?: string; category?: string }) {
  const last = await prisma.skill.findFirst({ where: { resumeId }, orderBy: { order: "desc" } });
  return prisma.skill.create({
    data: { resumeId, name: data.name, level: data.level, category: data.category, order: (last?.order || 0) + 1 },
  });
}

export async function addProject(resumeId: string, data: {
  name: string; description?: string; techStack?: string[]; url?: string;
}) {
  const last = await prisma.project.findFirst({ where: { resumeId }, orderBy: { order: "desc" } });
  return prisma.project.create({
    data: { resumeId, name: data.name, description: data.description, techStack: data.techStack || [], url: data.url, order: (last?.order || 0) + 1 },
  });
}

export async function addWorkExperience(resumeId: string, data: {
  company: string; role: string; location?: string; description?: string;
  highlights?: string[]; startDate: Date; endDate?: Date; current?: boolean;
}) {
  const last = await prisma.workExperience.findFirst({ where: { resumeId }, orderBy: { order: "desc" } });
  return prisma.workExperience.create({
    data: { resumeId, ...data, order: (last?.order || 0) + 1 },
  });
}

export async function addEducation(resumeId: string, data: {
  institution: string; degree: string; field?: string; grade?: string;
  startDate: Date; endDate?: Date; current?: boolean;
}) {
  const last = await prisma.education.findFirst({ where: { resumeId }, orderBy: { order: "desc" } });
  return prisma.education.create({
    data: { resumeId, ...data, order: (last?.order || 0) + 1 },
  });
}

// ─── Resume Version ─────────────────────────

export async function saveResumeVersion(resumeId: string) {
  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      skills: true, projects: true, workExperiences: true,
      educations: true, certifications: true, resumeAchievements: true,
    },
  });
  if (!resume) throw new Error("Resume not found");

  const lastVersion = await prisma.resumeVersion.findFirst({
    where: { resumeId },
    orderBy: { version: "desc" },
  });

  return prisma.resumeVersion.create({
    data: {
      resumeId,
      version: (lastVersion?.version || 0) + 1,
      snapshot: {
        title: resume.title,
        template: resume.template,
        summary: resume.summary,
        skills: resume.skills,
        projects: resume.projects,
        workExperiences: resume.workExperiences,
        educations: resume.educations,
        certifications: resume.certifications,
        achievements: resume.resumeAchievements,
      } as unknown as Prisma.InputJsonValue,
    },
  });
}
