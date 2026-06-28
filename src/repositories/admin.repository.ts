// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Admin Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import type { AuditAction, ReportStatus } from "@/generated/prisma/client";

export const adminRepository = {
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
