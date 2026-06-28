// ══════════════════════════════════════════════════════════════
// InterviewHub AI — API Utilities
// Shared response format, pagination, error handling
// ══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { z } from "zod";

// ─── Standard Response Format ───────────────

export function successResponse<T>(data: T, message = "Success", meta?: Record<string, unknown>) {
  return NextResponse.json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  });
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = "Success"
) {
  return NextResponse.json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

export function errorResponse(
  message: string,
  status: number,
  code?: string,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      code: code || `ERR_${status}`,
      message,
      details,
      requestId: crypto.randomUUID(),
    },
    { status }
  );
}

// ─── Common Error Responses ─────────────────

export const errors = {
  badRequest: (message = "Bad request", details?: unknown) =>
    errorResponse(message, 400, "BAD_REQUEST", details),
  unauthorized: (message = "Unauthorized") =>
    errorResponse(message, 401, "UNAUTHORIZED"),
  forbidden: (message = "Forbidden") =>
    errorResponse(message, 403, "FORBIDDEN"),
  notFound: (message = "Not found") =>
    errorResponse(message, 404, "NOT_FOUND"),
  conflict: (message = "Conflict") =>
    errorResponse(message, 409, "CONFLICT"),
  validation: (issues: z.ZodIssue[]) =>
    errorResponse(
      issues[0]?.message || "Validation error",
      422,
      "VALIDATION_ERROR",
      issues.map((i) => ({ path: i.path.join("."), message: i.message }))
    ),
  rateLimited: (message = "Too many requests") =>
    errorResponse(message, 429, "RATE_LIMITED"),
  internal: (message = "Internal server error") =>
    errorResponse(message, 500, "INTERNAL_ERROR"),
};

// ─── Pagination Helpers ─────────────────────

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function parseSorting(searchParams: URLSearchParams, allowedFields: string[]) {
  const sortField = searchParams.get("sort") || allowedFields[0] || "createdAt";
  const sortOrder = searchParams.get("order") === "asc" ? "asc" as const : "desc" as const;
  if (!allowedFields.includes(sortField)) {
    return { [allowedFields[0] || "createdAt"]: sortOrder };
  }
  return { [sortField]: sortOrder };
}

// ─── Validation Helper ──────────────────────

export function validateBody<T extends z.ZodType>(schema: T, body: unknown): z.infer<T> | NextResponse {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return errors.validation(parsed.error.issues);
  }
  return parsed.data;
}
