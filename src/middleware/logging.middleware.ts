// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Logging Middleware Helper
// ══════════════════════════════════════════════════════════════

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function requestIdMiddleware(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const requestId =
    request.headers.get("x-request-id") || crypto.randomUUID();
  response.headers.set("x-request-id", requestId);
  return response;
}

export function loggingMiddleware(request: NextRequest): void {
  if (process.env.NODE_ENV === "development") {
    console.log(
      JSON.stringify({
        method: request.method,
        path: request.nextUrl.pathname,
        timestamp: new Date().toISOString(),
      })
    );
  }
}
