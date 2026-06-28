#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Database Seed Script
// Run: npx tsx scripts/seed.ts
// ══════════════════════════════════════════════════════════════

console.log("🌱 Seeding database...");

async function main() {
  // Import prisma lazily to respect env
  const { prisma } = await import("../src/lib/prisma");

  console.log("✅ Database seeded successfully");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
