import { z } from "zod";

// ─── Auth ────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

// ─── Content ─────────────────────────────────
export const articleSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50),
  excerpt: z.string().max(500).optional(),
  topicId: z.string().uuid(),
  subTopicId: z.string().uuid().optional(),
  tags: z.array(z.string()).max(10).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export const questionSchema = z.object({
  title: z.string().min(5).max(300),
  content: z.string().min(10),
  answer: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  topicId: z.string().uuid(),
  companyId: z.string().uuid().optional(),
  type: z.enum(["THEORY", "CODING", "SYSTEM_DESIGN", "BEHAVIORAL", "HR"]),
  tags: z.array(z.string()).max(10).optional(),
});

// ─── Community ───────────────────────────────
export const postSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  tags: z.array(z.string()).max(10).optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  postId: z.string().uuid().optional(),
  articleId: z.string().uuid().optional(),
  parentId: z.string().uuid().optional(),
});

export const experienceSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(50),
  companyId: z.string().uuid(),
  role: z.string().min(2).max(100),
  result: z.enum(["SELECTED", "REJECTED", "IN_PROGRESS", "WAITLISTED"]),
  rounds: z.number().int().min(1).max(20),
  yoe: z.number().int().min(0).max(50).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

// ─── Search ──────────────────────────────────
export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(["all", "articles", "questions", "companies", "posts"]).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

// ─── Coding ──────────────────────────────────
export const submissionSchema = z.object({
  problemId: z.string().uuid(),
  code: z.string().min(1).max(50000),
  language: z.enum(["javascript", "typescript", "python", "java", "cpp", "go", "rust", "csharp", "ruby", "swift", "kotlin", "c"]),
});

// ─── Types ───────────────────────────────────
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
