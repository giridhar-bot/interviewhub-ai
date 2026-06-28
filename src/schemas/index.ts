// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Schemas Barrel Export
// Zod schemas for validation
// ══════════════════════════════════════════════════════════════

import { z } from "zod";

// ─── Auth ───────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens and underscores"),
});

// ─── Content ────────────────────────────────
export const articleSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(3).max(200),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  topicId: z.string().uuid(),
  subTopicId: z.string().uuid().optional(),
  tags: z.array(z.string()).max(10).optional(),
});

// ─── Pagination ─────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// ─── Search ─────────────────────────────────
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(["all", "articles", "companies", "problems", "discussions"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// ─── Resume ─────────────────────────────────
export const resumeSchema = z.object({
  title: z.string().min(1).max(100),
  template: z.string().optional(),
  content: z.string().min(1),
});

// ─── Feedback ───────────────────────────────
export const reportSchema = z.object({
  entityType: z.string(),
  entityId: z.string().uuid(),
  reason: z.string(),
  description: z.string().max(1000).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type ResumeInput = z.infer<typeof resumeSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
