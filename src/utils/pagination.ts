// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Pagination Utilities
// ══════════════════════════════════════════════════════════════

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}

export function parsePagination(
  searchParams: URLSearchParams,
  defaults = { page: 1, limit: 20, maxLimit: 50 }
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || String(defaults.page)));
  const limit = Math.min(
    defaults.maxLimit,
    Math.max(1, parseInt(searchParams.get("limit") || String(defaults.limit)))
  );
  return { page, limit };
}

export function paginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}

export function skip(page: number, limit: number): number {
  return (page - 1) * limit;
}
