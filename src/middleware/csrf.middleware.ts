// ══════════════════════════════════════════════════════════════
// InterviewHub AI — CSRF Middleware Helper
// ══════════════════════════════════════════════════════════════

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfMiddleware(request: NextRequest): NextResponse | null {
  if (SAFE_METHODS.has(request.method)) return null;

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return null;

  const originHost = new URL(origin).host;
  if (originHost !== host) {
    return NextResponse.json(
      { success: false, code: "CSRF_ERROR", message: "CSRF validation failed" },
      { status: 403 }
    );
  }

  return null;
}
