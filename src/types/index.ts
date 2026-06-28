// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Types Barrel Export
// ══════════════════════════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  details?: unknown;
  requestId: string;
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}
