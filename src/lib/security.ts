// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Security Utilities
// ══════════════════════════════════════════════════════════════

import { headers } from "next/headers";
import crypto from "crypto";

/** Get client IP from request headers */
export async function getClientIP(): Promise<string> {
  const hdrs = await headers();
  return (
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "127.0.0.1"
  );
}

/** Get user agent from request headers */
export async function getUserAgent(): Promise<string> {
  const hdrs = await headers();
  return hdrs.get("user-agent") || "unknown";
}

/** Sanitize user input — strip HTML tags */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/** Generate a secure random token */
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/** Generate a secure random 6-digit OTP */
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/** Hash a token for storage (don't store raw tokens) */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Constant-time string comparison to prevent timing attacks */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/** Check if password meets strength requirements */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) errors.push("Must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Must contain an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Must contain a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Must contain a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Must contain a special character");

  return { valid: errors.length === 0, errors };
}

/** Mask email for display (g***r@example.com) */
export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}***${name[name.length - 1]}@${domain}`;
}
