// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Admin Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import type { AuditAction, ReportStatus } from "@/generated/prisma/client";

export const adminRepository = {
  async getCompanyAdminList(limit = 100) {
    return prisma.company.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      take: limit,
      include: {
        _count: { select: { questions: true, experiences: true, salaryInsights: true } },
      },
    });
  },

  async getUserAdminList(limit = 50) {
    return prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        role: true,
        status: true,
        bannedAt: true,
        createdAt: true,
        xp: true,
      },
    });
  },

  async getUserAdminStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    const [total, activeToday, premium, newThisWeek] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null, lastActiveAt: { gte: today } } }),
      prisma.user.count({ where: { deletedAt: null, plan: { not: "FREE" } } }),
      prisma.user.count({ where: { deletedAt: null, createdAt: { gte: weekStart } } }),
    ]);

    return { total, activeToday, premium, newThisWeek };
  },

  async getCodingProblemAdminData(limit = 100) {
    const where = { deletedAt: null };
    const [problems, total, difficulties] = await Promise.all([
      prisma.codingProblem.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
        include: { _count: { select: { submissions: true } } },
      }),
      prisma.codingProblem.count({ where }),
      prisma.codingProblem.groupBy({
        by: ["difficulty"],
        where,
        _count: true,
      }),
    ]);

    return {
      problems,
      total,
      difficulties: {
        EASY: difficulties.find((item) => item.difficulty === "EASY")?._count ?? 0,
        MEDIUM: difficulties.find((item) => item.difficulty === "MEDIUM")?._count ?? 0,
        HARD: difficulties.find((item) => item.difficulty === "HARD")?._count ?? 0,
      },
    };
  },

  // ── Audit Logs ──────────────────────────────
  async createAuditLog(data: {
    userId?: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    oldData?: unknown;
    newData?: unknown;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        ...data,
        oldData: data.oldData ? (data.oldData as object) : undefined,
        newData: data.newData ? (data.newData as object) : undefined,
      },
    });
  },

  async getAuditLogs(page = 1, limit = 50, filters?: {
    userId?: string;
    action?: AuditAction;
    entityType?: string;
  }) {
    const where = { ...filters };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, displayName: true, email: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  },

  // ── Reports ─────────────────────────────────
  async getReports(status?: ReportStatus, page = 1, limit = 20) {
    const where = status ? { status } : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          reporter: { select: { id: true, displayName: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total, page, totalPages: Math.ceil(total / limit) };
  },

  async resolveReport(id: string, resolvedBy: string) {
    return prisma.report.update({
      where: { id },
      data: { status: "RESOLVED", resolvedBy, resolvedAt: new Date() },
    });
  },

  // ── Feature Flags ───────────────────────────
  async getFeatureFlags() {
    return prisma.featureFlag.findMany({ orderBy: { name: "asc" } });
  },

  async toggleFeatureFlag(name: string, enabled: boolean, updatedBy?: string) {
    return prisma.featureFlag.update({
      where: { name },
      data: { enabled, updatedBy },
    });
  },

  // ── System Settings ─────────────────────────
  async getSetting(key: string) {
    return prisma.systemSetting.findUnique({ where: { key } });
  },

  async getSettings() {
    return prisma.systemSetting.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });
  },

  async updateSetting(key: string, value: unknown, updatedBy?: string) {
    return prisma.systemSetting.upsert({
      where: { key },
      update: { value: value as object, updatedBy },
      create: { key, value: value as object, updatedBy },
    });
  },

  // ── Moderation ──────────────────────────────
  async getModerationQueue(page = 1, limit = 20) {
    const where = { resolvedAt: null };

    const [items, total] = await Promise.all([
      prisma.moderationQueue.findMany({
        where,
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.moderationQueue.count({ where }),
    ]);

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  async resolveModerationItem(id: string) {
    return prisma.moderationQueue.update({
      where: { id },
      data: { resolvedAt: new Date() },
    });
  },
};
