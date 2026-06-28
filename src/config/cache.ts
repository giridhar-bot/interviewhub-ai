// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Cache Configuration
// ══════════════════════════════════════════════════════════════

export const cacheConfig = {
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
    prefix: "ihub:",
  },
  ttl: {
    short: 60, // 1 min
    medium: 300, // 5 min
    long: 3600, // 1 hr
    day: 86_400, // 24 hr
  },
  staleWhileRevalidate: true,
} as const;
