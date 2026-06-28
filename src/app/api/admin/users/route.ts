import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdmin, isRoleAtLeast } from "@/lib/rbac";
import { auditLog } from "@/services/audit.service";
import type { RoleType } from "@/generated/prisma/client";
import { z } from "zod";

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(["change_role", "ban", "unban"]),
  role: z.enum(["USER", "PREMIUM", "AUTHOR", "MODERATOR", "ADMIN", "SUPER_ADMIN"]).optional(),
  reason: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !isAdmin(session.user.role as RoleType)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateRoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { userId, action, role, reason } = parsed.data;

  // Cannot modify yourself
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, bannedAt: true },
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Cannot modify users with equal or higher role
  if (isRoleAtLeast(targetUser.role, session.user.role as RoleType)) {
    return NextResponse.json({ error: "Cannot modify a user with equal or higher role" }, { status: 403 });
  }

  switch (action) {
    case "change_role": {
      if (!role) {
        return NextResponse.json({ error: "Role is required" }, { status: 400 });
      }
      // Cannot assign a role equal or higher than your own
      if (isRoleAtLeast(role as RoleType, session.user.role as RoleType)) {
        return NextResponse.json({ error: "Cannot assign this role" }, { status: 403 });
      }

      await prisma.user.update({ where: { id: userId }, data: { role: role as RoleType } });
      await auditLog.roleChange(session.user.id, userId, targetUser.role, role);
      break;
    }

    case "ban": {
      await prisma.user.update({ where: { id: userId }, data: { bannedAt: new Date() } });
      await auditLog.ban(session.user.id, userId, reason);
      break;
    }

    case "unban": {
      await prisma.user.update({ where: { id: userId }, data: { bannedAt: null } });
      await auditLog.unban(session.user.id, userId);
      break;
    }
  }

  return NextResponse.json({ success: true });
}
