// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Rate Limit Middleware Helper
// ══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimitMiddleware(
  request: NextRequest,
  { maxRequests = 60, windowMs = 60_000 } = {}
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return NextResponse.json(
      { success: false, code: "RATE_LIMITED", message: "Too many requests" },
      { status: 429 }
    );
  }

  return null;
}
