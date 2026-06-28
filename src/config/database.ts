// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Database Configuration
// ══════════════════════════════════════════════════════════════

export const databaseConfig = {
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_DATABASE_URL,
  poolMin: 2,
  poolMax: 10,
  connectionTimeout: 10_000, // ms
  idleTimeout: 30_000, // ms
} as const;
