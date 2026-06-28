import { generateText, streamText, type ModelMessage } from "ai";
import { getModel, getModelByTier, calculateCost, type AIModel, type AIProvider, AI_MODELS } from "./providers";
import { buildPrompt, PROMPTS } from "./prompts";
import { retrieveContext, compressContext } from "./rag";
import { checkSafety, sanitizeOutput } from "./safety";
import { trackAIUsage } from "./analytics";
import { logger } from "@/lib/logger";
import { getCache, setCache } from "@/lib/redis";

// ═══════════════════════════════════════════════
// AI GATEWAY — Central orchestrator for all AI calls
// ═══════════════════════════════════════════════

export type AIModule =
  | "tutor"
  | "doubtSolver"
  | "mockInterview"
  | "resumeATS"
  | "codeReview"
  | "codeExplainer"
  | "roadmapGenerator"
  | "studyPlanner"
  | "flashcardGenerator"
  | "quizGenerator"
  | "systemDesignReviewer"
  | "careerAdvisor"
  | "salaryInsights";

interface AIGatewayOptions {
  module: AIModule;
  messages: ModelMessage[];
  userId: string;
  // Optional overrides
  provider?: AIProvider;
  model?: AIModel;
  tier?: keyof typeof AI_MODELS;
  // RAG options
  useRAG?: boolean;
  ragTopicHint?: string;
  ragEntityTypes?: string[];
  // Behavior
  stream?: boolean;
  maxTokens?: number;
  temperature?: number;
  cacheKey?: string;
  cacheTTL?: number;
  // Extra context
  additionalInstructions?: string;
}

interface AIGatewayResult {
  text: string;
  usage: { inputTokens: number; outputTokens: number; totalTokens: number };
  cost: number;
  model: string;
  sources?: { title: string; type: string; id: string }[];
  cached: boolean;
}

// ─── Generate (non-streaming) ────────────────

export async function aiGenerate(options: AIGatewayOptions): Promise<AIGatewayResult> {
  const startTime = Date.now();

  // 1. Safety check on user input
  const lastUserMessage = options.messages.findLast((m) => m.role === "user");
  if (lastUserMessage && typeof lastUserMessage.content === "string") {
    const safetyResult = checkSafety(lastUserMessage.content);
    if (!safetyResult.safe) {
      return {
        text: safetyResult.message || "I can't process that request. Please rephrase your question.",
        usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        cost: 0,
        model: "safety-filter",
        cached: false,
      };
    }
  }

  // 2. Check cache
  if (options.cacheKey) {
    const cached = await getCache<AIGatewayResult>(options.cacheKey);
    if (cached) {
      logger.debug("AI cache hit", { module: options.module, cacheKey: options.cacheKey });
      return { ...cached, cached: true };
    }
  }

  // 3. RAG context retrieval
  let ragContext = "";
  let sources: { title: string; type: string; id: string }[] = [];
  if (options.useRAG && lastUserMessage && typeof lastUserMessage.content === "string") {
    const context = await retrieveContext(lastUserMessage.content, {
      topicHint: options.ragTopicHint,
      entityTypes: options.ragEntityTypes,
    });
    ragContext = compressContext(context.contextText);
    sources = context.sources;
  }

  // 4. Build system prompt
  const systemPrompt = getSystemPrompt(options.module);
  const fullSystemPrompt = buildPrompt(
    systemPrompt,
    ragContext || undefined,
    options.additionalInstructions
  );

  // 5. Select model
  const model = options.model && options.provider
    ? getModel({ provider: options.provider, model: options.model })
    : getModelByTier(options.tier || getDefaultTier(options.module));

  const modelName = options.model || AI_MODELS[options.tier || getDefaultTier(options.module)].model;

  // 6. Generate
  try {
    const result = await generateText({
      model,
      system: fullSystemPrompt,
      messages: options.messages,
      maxOutputTokens: options.maxTokens || 2000,
      temperature: options.temperature ?? 0.7,
    });

    const inputTokens = result.usage?.inputTokens || 0;
    const outputTokens = result.usage?.outputTokens || 0;
    const cost = calculateCost(modelName, inputTokens, outputTokens);

    // 7. Safety check on output
    const sanitizedText = sanitizeOutput(result.text);

    // 8. Track analytics
    await trackAIUsage({
      module: options.module,
      userId: options.userId,
      model: modelName,
      inputTokens,
      outputTokens,
      cost,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    const gatewayResult: AIGatewayResult = {
      text: sanitizedText,
      usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens },
      cost,
      model: modelName,
      sources: sources.length > 0 ? sources : undefined,
      cached: false,
    };

    // 9. Cache if configured
    if (options.cacheKey) {
      await setCache(options.cacheKey, gatewayResult, options.cacheTTL || 3600);
    }

    return gatewayResult;
  } catch (error) {
    logger.error("AI Gateway generation failed", {
      module: options.module,
      model: modelName,
      error,
    });
    throw error;
  }
}

// ─── Stream (for real-time responses) ────────

export async function aiStream(options: AIGatewayOptions) {
  // 1. Safety check
  const lastUserMessage = options.messages.findLast((m) => m.role === "user");
  if (lastUserMessage && typeof lastUserMessage.content === "string") {
    const safetyResult = checkSafety(lastUserMessage.content);
    if (!safetyResult.safe) {
      throw new Error(safetyResult.message || "Unsafe input detected");
    }
  }

  // 2. RAG context
  let ragContext = "";
  if (options.useRAG && lastUserMessage && typeof lastUserMessage.content === "string") {
    const context = await retrieveContext(lastUserMessage.content, {
      topicHint: options.ragTopicHint,
      entityTypes: options.ragEntityTypes,
    });
    ragContext = compressContext(context.contextText);
  }

  // 3. Build prompt
  const systemPrompt = getSystemPrompt(options.module);
  const fullSystemPrompt = buildPrompt(
    systemPrompt,
    ragContext || undefined,
    options.additionalInstructions
  );

  // 4. Select model
  const model = options.model && options.provider
    ? getModel({ provider: options.provider, model: options.model })
    : getModelByTier(options.tier || getDefaultTier(options.module));

  const modelName = options.model || AI_MODELS[options.tier || getDefaultTier(options.module)].model;

  // 5. Stream
  const result = streamText({
    model,
    system: fullSystemPrompt,
    messages: options.messages,
    maxOutputTokens: options.maxTokens || 2000,
    temperature: options.temperature ?? 0.7,
    async onFinish({ usage }) {
      // Track analytics after stream completes
      const inputTokens = usage?.inputTokens || 0;
      const outputTokens = usage?.outputTokens || 0;
      await trackAIUsage({
        module: options.module,
        userId: options.userId,
        model: modelName,
        inputTokens,
        outputTokens,
        cost: calculateCost(modelName, inputTokens, outputTokens),
        latencyMs: 0,
        cached: false,
      });
    },
  });

  return result;
}

// ─── Helper: Get system prompt for module ────

function getSystemPrompt(module: AIModule): string {
  switch (module) {
    case "tutor": return PROMPTS.tutor.system;
    case "doubtSolver": return PROMPTS.doubtSolver.system;
    case "mockInterview": return PROMPTS.mockInterview.technical.system;
    case "resumeATS": return PROMPTS.resumeATS.system;
    case "codeReview": return PROMPTS.codeReview.system;
    case "codeExplainer": return PROMPTS.codeExplainer.system;
    case "roadmapGenerator": return PROMPTS.roadmapGenerator.system;
    case "studyPlanner": return PROMPTS.studyPlanner.system;
    case "flashcardGenerator": return PROMPTS.flashcardGenerator.system;
    case "quizGenerator": return PROMPTS.quizGenerator.system;
    case "systemDesignReviewer": return PROMPTS.systemDesignReviewer.system;
    case "careerAdvisor": return PROMPTS.careerAdvisor.system;
    case "salaryInsights": return PROMPTS.salaryInsights.system;
    default: return PROMPTS.tutor.system;
  }
}

// ─── Helper: Default model tier per module ───

function getDefaultTier(module: AIModule): keyof typeof AI_MODELS {
  switch (module) {
    case "tutor":
    case "doubtSolver":
    case "codeExplainer":
    case "salaryInsights":
      return "fast";
    case "codeReview":
    case "roadmapGenerator":
    case "studyPlanner":
    case "flashcardGenerator":
    case "quizGenerator":
    case "careerAdvisor":
      return "balanced";
    case "mockInterview":
    case "resumeATS":
    case "systemDesignReviewer":
      return "premium";
    default:
      return "balanced";
  }
}
