// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Audit Logging Service
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { getClientIP, getUserAgent } from "@/lib/security";
import type { AuditAction } from "@/generated/prisma/client";

interface AuditLogInput {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldData?: unknown;
  newData?: unknown;
}

/** Create an audit log entry with auto-captured IP/UA */
export async function audit(input: AuditLogInput) {
  try {
    let ipAddress: string | undefined;
    let userAgent: string | undefined;

    try {
      ipAddress = await getClientIP();
      userAgent = await getUserAgent();
    } catch {
      // Not in a request context (e.g., background job)
    }

    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        oldData: input.oldData ? (input.oldData as object) : undefined,
        newData: input.newData ? (input.newData as object) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Never let audit logging break the main flow
    console.error("[Audit] Failed to create log:", error);
  }
}

// ─── Convenience Methods ─────────────────────

export const auditLog = {
  /** Log a login event */
  login(userId: string, provider: string) {
    return audit({
      userId,
      action: "LOGIN",
      entityType: "user",
      entityId: userId,
      newData: { provider },
    });
  },

  /** Log a logout event */
  logout(userId: string) {
    return audit({
      userId,
      action: "LOGOUT",
      entityType: "user",
      entityId: userId,
    });
  },

  /** Log content creation */
  create(userId: string, entityType: string, entityId: string, data?: unknown) {
    return audit({
      userId,
      action: "CREATE",
      entityType,
      entityId,
      newData: data,
    });
  },

  /** Log content update */
  update(userId: string, entityType: string, entityId: string, oldData?: unknown, newData?: unknown) {
    return audit({
      userId,
      action: "UPDATE",
      entityType,
      entityId,
      oldData,
      newData,
    });
  },

  /** Log content deletion */
  delete(userId: string, entityType: string, entityId: string, oldData?: unknown) {
    return audit({
      userId,
      action: "DELETE",
      entityType,
      entityId,
      oldData,
    });
  },

  /** Log a role change */
  roleChange(adminId: string, targetUserId: string, oldRole: string, newRole: string) {
    return audit({
      userId: adminId,
      action: "ROLE_CHANGE",
      entityType: "user",
      entityId: targetUserId,
      oldData: { role: oldRole },
      newData: { role: newRole },
    });
  },

  /** Log a ban action */
  ban(adminId: string, targetUserId: string, reason?: string) {
    return audit({
      userId: adminId,
      action: "BAN",
      entityType: "user",
      entityId: targetUserId,
      newData: { reason },
    });
  },

  /** Log an unban action */
  unban(adminId: string, targetUserId: string) {
    return audit({
      userId: adminId,
      action: "UNBAN",
      entityType: "user",
      entityId: targetUserId,
    });
  },
};
