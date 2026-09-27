import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const cacheEnabled = Boolean(process.env.REDIS_URL);

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

let redisWarningShown = false;
redis.on("error", () => {
  if (process.env.REDIS_URL && process.env.NODE_ENV === "development" && !redisWarningShown) {
    redisWarningShown = true;
    console.warn("Redis cache unavailable; continuing without cache.");
  }
});

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// ─── Cache Helpers ───────────────────────────────

const DEFAULT_TTL = 60 * 60; // 1 hour

export async function getCache<T>(key: string): Promise<T | null> {
  if (!cacheEnabled) return null;
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  if (!cacheEnabled) return;
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch {
    // silently fail — cache is not critical
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!cacheEnabled) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {
    // silently fail
  }
}

export async function deleteCache(key: string): Promise<void> {
  if (!cacheEnabled) return;
  try {
    await redis.del(key);
  } catch {
    // silently fail
  }
}
