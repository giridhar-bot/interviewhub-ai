// ══════════════════════════════════════════════════════════════
// InterviewHub AI — AI Provider Configuration
// ══════════════════════════════════════════════════════════════

export const aiConfig = {
  defaultProvider: "openai" as const,
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      defaultModel: "gpt-4o",
      maxTokens: 4096,
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
      defaultModel: "gemini-2.0-flash",
      maxTokens: 4096,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      defaultModel: "claude-sonnet-4-20250514",
      maxTokens: 4096,
    },
  },
  rateLimit: {
    free: { requestsPerDay: 10, tokensPerDay: 50_000 },
    pro: { requestsPerDay: 100, tokensPerDay: 500_000 },
    enterprise: { requestsPerDay: 1000, tokensPerDay: 5_000_000 },
  },
} as const;
