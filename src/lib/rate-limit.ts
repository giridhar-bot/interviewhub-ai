// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Rate Limiter (In-Memory + Redis)
// ══════════════════════════════════════════════════════════════

import { getCache, setCache } from "@/lib/redis";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

// In-memory fallback for when Redis is unavailable
const memoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit by key. Uses Redis if available, falls back to in-memory.
 * @param key - Unique identifier (e.g., `login:${ip}`)
 * @param limit - Max requests allowed
 * @param windowSeconds - Time window in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const resetAt = new Date(now + windowSeconds * 1000);
  const cacheKey = `ratelimit:${key}`;

  try {
    // Try Redis first
    const cached = await getCache<{ count: number; resetAt: number }>(cacheKey);

    if (cached && cached.resetAt > now) {
      const newCount = cached.count + 1;
      await setCache(cacheKey, { count: newCount, resetAt: cached.resetAt }, windowSeconds);
      return {
        success: newCount <= limit,
        limit,
        remaining: Math.max(0, limit - newCount),
        resetAt: new Date(cached.resetAt),
      };
    }

    // New window
    await setCache(cacheKey, { count: 1, resetAt: resetAt.getTime() }, windowSeconds);
    return { success: true, limit, remaining: limit - 1, resetAt };
  } catch {
    // Fallback to in-memory
    const entry = memoryStore.get(cacheKey);

    if (entry && entry.resetAt > now) {
      entry.count += 1;
      return {
        success: entry.count <= limit,
        limit,
        remaining: Math.max(0, limit - entry.count),
        resetAt: new Date(entry.resetAt),
      };
    }

    memoryStore.set(cacheKey, { count: 1, resetAt: resetAt.getTime() });
    return { success: true, limit, remaining: limit - 1, resetAt };
  }
}

// ─── Predefined Rate Limits ──────────────────

/** Login attempts: 5 per minute per IP */
export function rateLimitLogin(ip: string) {
  return rateLimit(`login:${ip}`, 5, 60);
}

/** Registration: 3 per hour per IP */
export function rateLimitRegister(ip: string) {
  return rateLimit(`register:${ip}`, 3, 3600);
}

/** Password reset: 3 per hour per email */
export function rateLimitPasswordReset(email: string) {
  return rateLimit(`password-reset:${email}`, 3, 3600);
}

/** API general: 100 per minute per IP */
export function rateLimitAPI(ip: string) {
  return rateLimit(`api:${ip}`, 100, 60);
}

/** Search: 30 per minute per IP */
export function rateLimitSearch(ip: string) {
  return rateLimit(`search:${ip}`, 30, 60);
}

/** Code submission: 10 per minute per user */
export function rateLimitSubmission(userId: string) {
  return rateLimit(`submission:${userId}`, 10, 60);
}
