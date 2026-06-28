// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Auth Middleware Helper
// ══════════════════════════════════════════════════════════════

import type { NextRequest } from "next/server";

export function getSessionToken(request: NextRequest): string | undefined {
  return (
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value
  );
}

export function isAuthenticated(request: NextRequest): boolean {
  return !!getSessionToken(request);
}
