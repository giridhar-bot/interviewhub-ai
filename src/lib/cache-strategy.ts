// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Cache Strategy & Performance Config
// TTL configurations, cache patterns, performance monitoring
// ══════════════════════════════════════════════════════════════

// ─── Cache TTL Configuration (seconds) ──────

export const CACHE_TTL = {
  // Static / rarely changing content
  articles: 3600,        // 1 hour
  companies: 3600,       // 1 hour
  topics: 3600,          // 1 hour
  cheatSheets: 3600,     // 1 hour
  roadmaps: 3600,        // 1 hour
  metadata: 7200,        // 2 hours
  sitemapData: 86400,    // 24 hours

  // Dynamic content
  searchSuggestions: 600, // 10 min
  trendingContent: 300,   // 5 min
  leaderboard: 300,       // 5 min
  userProgress: 60,       // 1 min
  dashboardStats: 120,    // 2 min

  // Short-lived
  rateLimitWindow: 60,    // 1 min
  sessionData: 1800,      // 30 min
  otpCode: 600,           // 10 min

  // AI responses
  aiResponseCache: 1800,  // 30 min (same prompt = same response)
} as const;

// ─── Cache Key Patterns ─────────────────────

export const CACHE_KEYS = {
  article: (slug: string) => `article:${slug}`,
  company: (slug: string) => `company:${slug}`,
  topic: (slug: string) => `topic:${slug}`,
  roadmap: (slug: string) => `roadmap:${slug}`,
  userProgress: (userId: string) => `progress:${userId}`,
  leaderboard: (type: string) => `leaderboard:${type}`,
  searchSuggestions: (query: string) => `search:suggest:${query}`,
  trending: () => "trending:global",
  dashboardStats: (userId: string) => `dashboard:${userId}`,
  problemList: (category: string, page: number) => `problems:${category}:${page}`,
  heatmap: (userId: string) => `heatmap:${userId}`,
} as const;

// ─── Performance Monitoring ─────────────────

export function measurePerformance(label: string) {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      if (duration > 1000) {
        console.warn(`[PERF] Slow operation: ${label} took ${duration.toFixed(0)}ms`);
      }
      return duration;
    },
  };
}

// ─── Database Query Optimization Helpers ────

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 20,
  maxLimit: 100,
} as const;

export function normalizePagination(page?: number, limit?: number) {
  const p = Math.max(1, page || PAGINATION_DEFAULTS.page);
  const l = Math.min(PAGINATION_DEFAULTS.maxLimit, Math.max(1, limit || PAGINATION_DEFAULTS.limit));
  return { page: p, limit: l, skip: (p - 1) * l };
}

// ─── Performance Budget ─────────────────────

export const PERFORMANCE_BUDGET = {
  lighthouse: 95,
  ttfb: 200,        // ms
  fcp: 1800,        // ms
  lcp: 2500,        // ms
  cls: 0.1,
  fid: 100,         // ms
  apiLatencyP50: 100,  // ms
  apiLatencyP99: 500,  // ms
  cacheHitRatio: 0.8,  // 80%
} as const;

// ─── Core Web Vitals Thresholds ─────────────

export const CWV_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
} as const;
