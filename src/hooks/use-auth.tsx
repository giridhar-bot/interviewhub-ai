// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Client-side Auth Hooks & Components
// ══════════════════════════════════════════════════════════════

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  hasPermission,
  hasAnyPermission,
  isAdmin,
  isPremium,
  type Permission,
} from "@/lib/rbac";
import type { RoleType, Plan } from "@/generated/prisma/client";

// ─── useCurrentUser ──────────────────────────
export function useCurrentUser() {
  const { data: session, status } = useSession();

  return useMemo(
    () => ({
      user: session?.user ?? null,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      isAdmin: session?.user ? isAdmin(session.user.role as RoleType) : false,
      isPremium: session?.user
        ? isPremium(session.user.plan as Plan) || isAdmin(session.user.role as RoleType)
        : false,
    }),
    [session, status]
  );
}

// ─── useRequireAuth ──────────────────────────
export function useRequireAuth(redirectTo = "/auth/login") {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?callbackUrl=${window.location.pathname}`);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return { user, isLoading };
}

// ─── usePermission ───────────────────────────
export function usePermission(permission: Permission) {
  const { user } = useCurrentUser();
  if (!user) return false;
  return hasPermission(user.role as RoleType, user.plan as Plan, permission);
}

// ─── useAnyPermission ────────────────────────
export function useAnyPermission(permissions: Permission[]) {
  const { user } = useCurrentUser();
  if (!user) return false;
  return hasAnyPermission(user.role as RoleType, user.plan as Plan, permissions);
}

// ─── Gate Component — render children only if permitted ──
export function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const allowed = usePermission(permission);
  return allowed ? <>{children}</> : <>{fallback}</>;
}

// ─── RoleGate Component ──────────────────────
export function RoleGate({
  role,
  fallback = null,
  children,
}: {
  role: "ADMIN" | "MODERATOR" | "AUTHOR" | "PREMIUM";
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user } = useCurrentUser();
  if (!user) return <>{fallback}</>;

  const roleHierarchy: Record<string, number> = {
    USER: 0,
    PREMIUM: 1,
    AUTHOR: 2,
    MODERATOR: 3,
    ADMIN: 4,
    SUPER_ADMIN: 5,
  };

  const userLevel = roleHierarchy[user.role] ?? 0;
  const requiredLevel = roleHierarchy[role] ?? 0;

  return userLevel >= requiredLevel ? <>{children}</> : <>{fallback}</>;
}

// ─── PremiumGate Component ───────────────────
export function PremiumGate({
  fallback = null,
  children,
}: {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isPremium } = useCurrentUser();
  return isPremium ? <>{children}</> : <>{fallback}</>;
}

// ─── AuthGate Component ─────────────────────
export function AuthGate({
  fallback = null,
  children,
}: {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useCurrentUser();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}
