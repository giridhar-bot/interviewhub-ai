export { getModel, getModelByTier, calculateCost, AI_MODELS, MODEL_COSTS } from "./providers";
export type { AIProvider, AIModel } from "./providers";

export { PROMPTS, buildPrompt } from "./prompts";

export { generateEmbedding, generateEmbeddings, semanticSearch, indexContent, indexArticles, indexTopics, indexQuestions } from "./embeddings";
export type { SearchResult } from "./embeddings";

export { retrieveContext, rewriteQuery, compressContext } from "./rag";
export type { RAGContext } from "./rag";

export { aiGenerate, aiStream } from "./gateway";
export type { AIModule } from "./gateway";

export { checkSafety, sanitizeOutput, validateRetrievedContext } from "./safety";

export { trackAIUsage, getDailyStats, getUserDailyUsage, checkUsageLimit, getCostReport } from "./analytics";
