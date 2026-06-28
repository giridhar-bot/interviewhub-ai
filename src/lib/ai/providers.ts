import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

// ═══════════════════════════════════════════════
// AI PROVIDER ABSTRACTION LAYER
// ═══════════════════════════════════════════════

export type AIProvider = "openai" | "anthropic" | "google";

export type AIModel =
  // OpenAI
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4-turbo"
  | "o1-mini"
  // Anthropic
  | "claude-sonnet-4-20250514"
  | "claude-3-5-haiku-20241022"
  // Google
  | "gemini-2.0-flash"
  | "gemini-2.5-pro";

interface ProviderConfig {
  provider: AIProvider;
  model: AIModel;
}

// Default model per use case for cost optimization
export const AI_MODELS = {
  // Fast & cheap — for simple tasks
  fast: { provider: "openai" as AIProvider, model: "gpt-4o-mini" as AIModel },
  // Balanced — for tutor, code review
  balanced: { provider: "openai" as AIProvider, model: "gpt-4o" as AIModel },
  // Premium — for mock interviews, system design review
  premium: { provider: "anthropic" as AIProvider, model: "claude-sonnet-4-20250514" as AIModel },
  // Reasoning — for complex problems
  reasoning: { provider: "openai" as AIProvider, model: "o1-mini" as AIModel },
} as const;

// Model cost per 1K tokens (USD) for analytics
export const MODEL_COSTS: Record<AIModel, { input: number; output: number }> = {
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "o1-mini": { input: 0.003, output: 0.012 },
  "claude-sonnet-4-20250514": { input: 0.003, output: 0.015 },
  "claude-3-5-haiku-20241022": { input: 0.001, output: 0.005 },
  "gemini-2.0-flash": { input: 0.0001, output: 0.0004 },
  "gemini-2.5-pro": { input: 0.00125, output: 0.01 },
};

// ─── Provider Instances ──────────────────────

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || "",
});

// ─── Get Model Instance ─────────────────────

export function getModel(config?: Partial<ProviderConfig>): LanguageModel {
  const provider = config?.provider || AI_MODELS.balanced.provider;
  const model = config?.model || AI_MODELS.balanced.model;

  switch (provider) {
    case "openai":
      return openai(model);
    case "anthropic":
      return anthropic(model);
    case "google":
      return google(model);
    default:
      return openai(model);
  }
}

export function getModelByTier(tier: keyof typeof AI_MODELS): LanguageModel {
  const config = AI_MODELS[tier];
  return getModel(config);
}

// ─── Cost Calculation ────────────────────────

export function calculateCost(
  model: AIModel,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = MODEL_COSTS[model];
  if (!costs) return 0;
  return (inputTokens / 1000) * costs.input + (outputTokens / 1000) * costs.output;
}
