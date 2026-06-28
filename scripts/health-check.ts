#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Health Check Script
// Used in CI/CD pipelines
// ══════════════════════════════════════════════════════════════

const BASE_URL = process.env.APP_URL || "http://localhost:3000";

async function check() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();

    if (data.status === "ok") {
      console.log("✅ Health check passed");
      process.exit(0);
    } else {
      console.error("❌ Health check failed:", data);
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Health check error:", err);
    process.exit(1);
  }
}

check();
