// ══════════════════════════════════════════════════════════════
// InterviewHub AI — App Configuration
// ══════════════════════════════════════════════════════════════

export const appConfig = {
  name: "InterviewHub AI",
  env: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  version: process.env.npm_package_version || "1.0.0",
} as const;
