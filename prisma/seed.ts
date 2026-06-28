// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Master Seed Script
// Run: npm run db:seed
// ══════════════════════════════════════════════════════════════

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { topicsSeed } from "./seeds/topics";
import { companiesSeed } from "./seeds/companies";
import { badgesSeed, achievementsSeed } from "./seeds/badges";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding InterviewHub AI database...\n");

  // ── Topics ──────────────────────────────────
  console.log("📚 Seeding topics...");
  for (const topic of topicsSeed) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: { ...topic, status: "PUBLISHED" },
      create: { ...topic, status: "PUBLISHED" },
    });
  }
  console.log(`   ✅ ${topicsSeed.length} topics seeded`);

  // ── Companies ───────────────────────────────
  console.log("🏢 Seeding companies...");
  for (const company of companiesSeed) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: company,
      create: company,
    });
  }
  console.log(`   ✅ ${companiesSeed.length} companies seeded`);

  // ── Badges ──────────────────────────────────
  console.log("🏅 Seeding badges...");
  for (const badge of badgesSeed) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    });
  }
  console.log(`   ✅ ${badgesSeed.length} badges seeded`);

  // ── Achievements ────────────────────────────
  console.log("🏆 Seeding achievements...");
  for (const achievement of achievementsSeed) {
    await prisma.achievement.upsert({
      where: { slug: achievement.slug },
      update: achievement,
      create: achievement,
    });
  }
  console.log(`   ✅ ${achievementsSeed.length} achievements seeded`);

  // ── Languages ───────────────────────────────
  console.log("💻 Seeding languages...");
  const languages = [
    { name: "JavaScript", slug: "javascript", version: "ES2024" },
    { name: "TypeScript", slug: "typescript", version: "5.x" },
    { name: "Python", slug: "python", version: "3.12" },
    { name: "Java", slug: "java", version: "21" },
    { name: "C++", slug: "cpp", version: "C++20" },
    { name: "C", slug: "c", version: "C17" },
    { name: "Go", slug: "go", version: "1.22" },
    { name: "Rust", slug: "rust", version: "1.77" },
    { name: "C#", slug: "csharp", version: ".NET 8" },
    { name: "Ruby", slug: "ruby", version: "3.3" },
    { name: "Swift", slug: "swift", version: "5.10" },
    { name: "Kotlin", slug: "kotlin", version: "1.9" },
  ];
  for (const lang of languages) {
    await prisma.language.upsert({
      where: { slug: lang.slug },
      update: lang,
      create: lang,
    });
  }
  console.log(`   ✅ ${languages.length} languages seeded`);

  // ── System Settings ─────────────────────────
  console.log("⚙️  Seeding system settings...");
  const settings = [
    { key: "maintenance_mode", value: false, category: "system" },
    { key: "registration_enabled", value: true, category: "auth" },
    { key: "max_daily_submissions", value: 50, category: "coding" },
    { key: "default_daily_xp_goal", value: 50, category: "gamification" },
    { key: "streak_freeze_allowed", value: true, category: "gamification" },
  ];
  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, category: setting.category },
      create: { key: setting.key, value: setting.value, category: setting.category },
    });
  }
  console.log(`   ✅ ${settings.length} system settings seeded`);

  // ── Feature Flags ───────────────────────────
  console.log("🚩 Seeding feature flags...");
  const flags = [
    { name: "ai_tutor", description: "AI Tutor chatbot", enabled: true },
    { name: "mock_interviews", description: "AI Mock Interview feature", enabled: true },
    { name: "resume_builder", description: "Resume builder & ATS scorer", enabled: false },
    { name: "coding_contests", description: "Live coding contests", enabled: false },
    { name: "dark_mode", description: "Dark mode theme", enabled: true },
  ];
  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: flag,
      create: flag,
    });
  }
  console.log(`   ✅ ${flags.length} feature flags seeded`);

  console.log("\n✨ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
