// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Server Auth Guards
// Use in Server Components, API Routes, Server Actions
// ══════════════════════════════════════════════════════════════

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  hasPermission,
  hasAnyPermission,
  isRoleAtLeast,
  isAdmin,
  isPremium,
  type Permission,
} from "@/lib/rbac";
import type { RoleType, Plan } from "@/generated/prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  role: RoleType;
  plan: Plan;
  username?: string | null;
  displayName?: string | null;
  profileComplete: boolean;
};

/** Get current session — returns null if not authenticated */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    email: session.user.email!,
    role: session.user.role as RoleType,
    plan: session.user.plan as Plan,
    username: session.user.username,
    displayName: session.user.displayName,
    profileComplete: session.user.profileComplete,
  };
}

/** Require authentication — redirects to login if not authenticated */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

/** Require completed profile — redirects to onboarding if incomplete */
export async function requireProfile(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!user.profileComplete) {
    redirect("/onboarding");
  }
  return user;
}

/** Require a specific role (or higher) */
export async function requireRole(role: RoleType): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isRoleAtLeast(user.role, role)) {
    redirect("/dashboard?error=unauthorized");
  }
  return user;
}

/** Require admin access */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isAdmin(user.role)) {
    redirect("/dashboard?error=unauthorized");
  }
  return user;
}

/** Require premium plan */
export async function requirePremium(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isPremium(user.plan) && !isAdmin(user.role)) {
    redirect("/pricing?upgrade=true");
  }
  return user;
}

/** Require a specific permission */
export async function requirePermission(permission: Permission): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasPermission(user.role, user.plan, permission)) {
    redirect("/dashboard?error=unauthorized");
  }
  return user;
}

/** Require any of the specified permissions */
export async function requireAnyPermission(permissions: Permission[]): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasAnyPermission(user.role, user.plan, permissions)) {
    redirect("/dashboard?error=unauthorized");
  }
  return user;
}
