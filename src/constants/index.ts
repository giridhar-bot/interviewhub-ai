export const APP_NAME = "InterviewHub AI";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
} as const;

export const DIFFICULTY_COLORS = {
  EASY: { text: "text-green-600", bg: "bg-green-50", dark: "dark:bg-green-950" },
  MEDIUM: { text: "text-yellow-600", bg: "bg-yellow-50", dark: "dark:bg-yellow-950" },
  HARD: { text: "text-red-600", bg: "bg-red-50", dark: "dark:bg-red-950" },
} as const;

export const QUESTION_TYPES = {
  THEORY: "Theory",
  CODING: "Coding",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
  HR: "HR",
} as const;

export const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
] as const;

export const XP_REWARDS = {
  COMPLETE_ARTICLE: 10,
  SOLVE_EASY: 15,
  SOLVE_MEDIUM: 30,
  SOLVE_HARD: 50,
  DAILY_STREAK: 5,
  POST_DISCUSSION: 10,
  POST_EXPERIENCE: 25,
} as const;
