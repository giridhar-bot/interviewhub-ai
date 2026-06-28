// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Security Headers Configuration
// CSP, HSTS, and other security headers
// ══════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";

// ─── Security Headers ───────────────────────

export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
} as const;

// ─── Content Security Policy ────────────────

export function buildCSP(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com https://api.anthropic.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ];
  return directives.join("; ");
}

// ─── Apply Security Headers ─────────────────

export function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  response.headers.set("Content-Security-Policy", buildCSP());
  return response;
}

// ─── Validate Upload ────────────────────────

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateUpload(file: { type: string; size: number }): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { valid: false, error: `File type '${file.type}' is not allowed` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
  }
  return { valid: true };
}

// ─── Input Sanitization ─────────────────────

export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ─── OWASP Checklist Status ─────────────────

export const owaspStatus = {
  brokenAccessControl: "MITIGATED — RBAC via auth-guard.ts + rbac.ts",
  cryptographicFailures: "MITIGATED — bcryptjs for passwords, JWT for sessions",
  injection: "MITIGATED — Prisma parameterized queries, Zod validation",
  insecureDesign: "MITIGATED — Security by design, input validation",
  securityMisconfiguration: "MITIGATED — Security headers, CSP, HSTS",
  vulnerableComponents: "MONITOR — Regular dependency audits needed",
  authenticationFailures: "MITIGATED — Auth.js, rate limiting on login",
  dataIntegrityFailures: "MITIGATED — CSRF via SameSite cookies, signed tokens",
  loggingFailures: "MITIGATED — Audit logging via audit.service.ts",
  ssrf: "MITIGATED — No user-controlled URLs in server requests",
} as const;
