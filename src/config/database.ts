// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Database Configuration
// ══════════════════════════════════════════════════════════════

import { z } from "zod";

export const databaseConfig = {
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL_UNPOOLED,
  poolMin: 2,
  poolMax: 10,
  connectionTimeout: 10_000, // ms
  idleTimeout: 30_000, // ms
} as const;

export function getPrismaCliUrl(databaseUrl?: string, directUrl?: string) {
  const value = directUrl || databaseUrl;
  if (!value) return undefined;
  const parsed = z.url().safeParse(value);
  if (!parsed.success) throw new Error("Prisma CLI requires a valid PostgreSQL connection URL.");
  const url = new URL(parsed.data);
  if (!url.hostname || (url.protocol !== "postgresql:" && url.protocol !== "postgres:")) {
    throw new Error("Prisma CLI requires a PostgreSQL connection URL.");
  }
  // Neon transaction pooling cannot safely preserve migration advisory locks.
  if (url.hostname.endsWith(".neon.tech")) {
    url.hostname = url.hostname.replace("-pooler.", ".");
  }
  return url.toString();
}
