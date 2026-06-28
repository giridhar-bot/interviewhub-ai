// ══════════════════════════════════════════════════════════════
// InterviewHub AI — RBAC Permissions System
// ══════════════════════════════════════════════════════════════

import type { RoleType, Plan } from "@/generated/prisma/client";

// ─── Permission Definitions ──────────────────
export const PERMISSIONS = {
  // Content
  "content:read": "Read public content",
  "content:create": "Create content",
  "content:edit": "Edit own content",
  "content:edit_any": "Edit any content",
  "content:delete": "Delete own content",
  "content:delete_any": "Delete any content",
  "content:publish": "Publish content",

  // Community
  "community:comment": "Post comments",
  "community:post": "Create community posts",
  "community:vote": "Vote on content",
  "community:moderate": "Moderate community content",

  // Coding
  "coding:submit": "Submit code solutions",
  "coding:contest": "Join coding contests",

  // AI Features
  "ai:tutor": "Use AI Tutor",
  "ai:interview": "AI Mock Interview",
  "ai:resume": "AI Resume Review",
  "ai:premium": "Premium AI features",

  // Admin
  "admin:users": "Manage users",
  "admin:roles": "Manage roles",
  "admin:features": "Manage feature flags",
  "admin:analytics": "View analytics",
  "admin:settings": "Manage system settings",
  "admin:audit": "View audit logs",
  "admin:moderation": "Access moderation queue",

  // Premium
  "premium:advanced_analytics": "Advanced progress analytics",
  "premium:unlimited_submissions": "Unlimited daily submissions",
  "premium:priority_support": "Priority support",
} as const;

export type Permission = keyof typeof PERMISSIONS;

// ─── Role → Permission Mapping ───────────────
const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
  USER: [
    "content:read",
    "content:create",
    "content:edit",
    "content:delete",
    "community:comment",
    "community:post",
    "community:vote",
    "coding:submit",
    "ai:tutor",
  ],
  AUTHOR: [
    "content:read",
    "content:create",
    "content:edit",
    "content:delete",
    "content:publish",
    "community:comment",
    "community:post",
    "community:vote",
    "coding:submit",
    "ai:tutor",
  ],
  MODERATOR: [
    "content:read",
    "content:create",
    "content:edit",
    "content:edit_any",
    "content:delete",
    "content:delete_any",
    "content:publish",
    "community:comment",
    "community:post",
    "community:vote",
    "community:moderate",
    "coding:submit",
    "coding:contest",
    "ai:tutor",
    "ai:interview",
    "admin:moderation",
  ],
  ADMIN: [
    "content:read",
    "content:create",
    "content:edit",
    "content:edit_any",
    "content:delete",
    "content:delete_any",
    "content:publish",
    "community:comment",
    "community:post",
    "community:vote",
    "community:moderate",
    "coding:submit",
    "coding:contest",
    "ai:tutor",
    "ai:interview",
    "ai:resume",
    "ai:premium",
    "admin:users",
    "admin:features",
    "admin:analytics",
    "admin:settings",
    "admin:audit",
    "admin:moderation",
    "premium:advanced_analytics",
    "premium:unlimited_submissions",
    "premium:priority_support",
  ],
  PREMIUM: [
    "content:read",
    "content:create",
    "content:edit",
    "content:delete",
    "community:comment",
    "community:post",
    "community:vote",
    "coding:submit",
    "coding:contest",
    "ai:tutor",
    "ai:interview",
    "ai:resume",
    "premium:advanced_analytics",
    "premium:unlimited_submissions",
  ],
  SUPER_ADMIN: Object.keys(PERMISSIONS) as Permission[],
};

// ─── Plan → Extra Permissions ────────────────
const PLAN_PERMISSIONS: Record<Plan, Permission[]> = {
  FREE: [],
  PRO: [
    "ai:interview",
    "ai:resume",
    "coding:contest",
    "premium:advanced_analytics",
    "premium:unlimited_submissions",
  ],
  ENTERPRISE: [
    "ai:interview",
    "ai:resume",
    "ai:premium",
    "coding:contest",
    "premium:advanced_analytics",
    "premium:unlimited_submissions",
    "premium:priority_support",
  ],
};

// ─── Permission Check Utilities ──────────────

/** Get all permissions for a user (role + plan combined) */
export function getUserPermissions(role: RoleType, plan: Plan): Set<Permission> {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  const planPerms = PLAN_PERMISSIONS[plan] ?? [];
  return new Set([...rolePerms, ...planPerms]);
}

/** Check if a user has a specific permission */
export function hasPermission(role: RoleType, plan: Plan, permission: Permission): boolean {
  const perms = getUserPermissions(role, plan);
  return perms.has(permission);
}

/** Check if a user has ALL of the specified permissions */
export function hasAllPermissions(role: RoleType, plan: Plan, permissions: Permission[]): boolean {
  const perms = getUserPermissions(role, plan);
  return permissions.every((p) => perms.has(p));
}

/** Check if a user has ANY of the specified permissions */
export function hasAnyPermission(role: RoleType, plan: Plan, permissions: Permission[]): boolean {
  const perms = getUserPermissions(role, plan);
  return permissions.some((p) => perms.has(p));
}

// ─── Role Hierarchy ──────────────────────────
const ROLE_HIERARCHY: Record<RoleType, number> = {
  USER: 0,
  PREMIUM: 1,
  AUTHOR: 2,
  MODERATOR: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

/** Check if roleA is at least as high as roleB */
export function isRoleAtLeast(userRole: RoleType, requiredRole: RoleType): boolean {
  return (ROLE_HIERARCHY[userRole] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? 0);
}

/** Check if user is admin or super admin */
export function isAdmin(role: RoleType): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/** Check if user is premium (PRO or ENTERPRISE) */
export function isPremium(plan: Plan): boolean {
  return plan === "PRO" || plan === "ENTERPRISE";
}

// ─── Route Access Config ─────────────────────
export const ROUTE_ACCESS = {
  // Public routes — no auth needed
  public: [
    "/",
    "/topics",
    "/topics/[slug]",
    "/companies",
    "/companies/[slug]",
    "/articles",
    "/articles/[slug]",
    "/coding",
    "/interview",
    "/system-design",
    "/ai-tools",
    "/community",
    "/auth/login",
    "/auth/register",
    "/auth/verify-request",
    "/auth/error",
    "/auth/forgot-password",
    "/auth/reset-password",
  ],

  // Authenticated — any logged-in user
  authenticated: [
    "/dashboard",
    "/profile",
    "/settings",
    "/onboarding",
    "/bookmarks",
    "/coding/[slug]",
  ],

  // Premium — PRO or ENTERPRISE plan
  premium: [
    "/ai-tools/mock-interview",
    "/ai-tools/resume-review",
    "/analytics",
  ],

  // Admin — ADMIN or SUPER_ADMIN
  admin: [
    "/admin",
    "/admin/users",
    "/admin/content",
    "/admin/analytics",
    "/admin/settings",
    "/admin/audit",
    "/admin/moderation",
  ],
} as const;
