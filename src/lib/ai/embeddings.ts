import { embed, embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

// ═══════════════════════════════════════════════
// EMBEDDING PIPELINE
// ═══════════════════════════════════════════════

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
const EMBEDDING_MODEL = openai.embedding("text-embedding-3-small");
const EMBEDDING_DIMENSIONS = 1536;
const CACHE_TTL = 86400; // 24 hours

// ─── Generate Single Embedding ───────────────

export async function generateEmbedding(text: string): Promise<number[]> {
  const cacheKey = `emb:${hashText(text)}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const { embedding } = await embed({
      model: EMBEDDING_MODEL,
      value: text,
    });

    await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(embedding));
    return embedding;
  } catch (error) {
    logger.error("Embedding generation failed", { error, textLength: text.length });
    throw error;
  }
}

// ─── Generate Batch Embeddings ───────────────

export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  try {
    const { embeddings } = await embedMany({
      model: EMBEDDING_MODEL,
      values: texts,
    });
    return embeddings;
  } catch (error) {
    logger.error("Batch embedding generation failed", { error, count: texts.length });
    throw error;
  }
}

// ─── Cosine Similarity ──────────────────────

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// ─── Simple text hash for caching ────────────

function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

// ═══════════════════════════════════════════════
// VECTOR SEARCH (PostgreSQL-based)
// ═══════════════════════════════════════════════
// Note: For production, use pgvector extension.
// This implementation uses application-level similarity
// search as a starting point.

export interface SearchResult {
  id: string;
  entityType: string;
  title: string;
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

// ─── Index content for search ────────────────

export async function indexContent(
  entityType: string,
  entityId: string,
  title: string,
  content: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const text = `${title}\n\n${content}`.slice(0, 8000); // limit for embedding
  const embedding = await generateEmbedding(text);

  // Store in Redis for fast retrieval
  const key = `vec:${entityType}:${entityId}`;
  await redis?.setex(
    key,
    86400 * 7, // 7 days
    JSON.stringify({ entityType, entityId, title, content: content.slice(0, 2000), embedding, metadata })
  );

  // Track all indexed keys
  await redis?.sadd("vec:index", key);
}

// ─── Semantic Search ─────────────────────────

export async function semanticSearch(
  query: string,
  entityTypes?: string[],
  limit = 5,
  minSimilarity = 0.7
): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(query);

  // Get all indexed keys
  const allKeys = await redis?.smembers("vec:index");
  if (!allKeys?.length) return [];

  // Filter by entity type if specified
  const filteredKeys = entityTypes
    ? allKeys.filter((k) => entityTypes.some((t) => k.startsWith(`vec:${t}:`)))
    : allKeys;

  // Fetch all vectors and calculate similarity
  const results: SearchResult[] = [];

  // Process in batches of 50
  for (let i = 0; i < filteredKeys.length; i += 50) {
    const batch = filteredKeys.slice(i, i + 50);
    const pipeline = redis?.pipeline();
    for (const key of batch) {
      pipeline?.get(key);
    }
    const batchResults = await pipeline?.exec();

    if (batchResults) {
      for (const [err, data] of batchResults) {
        if (err || !data) continue;
        const item = JSON.parse(data as string);
        const similarity = cosineSimilarity(queryEmbedding, item.embedding);

        if (similarity >= minSimilarity) {
          results.push({
            id: item.entityId,
            entityType: item.entityType,
            title: item.title,
            content: item.content,
            similarity,
            metadata: item.metadata,
          });
        }
      }
    }
  }

  // Sort by similarity and limit
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// ─── Index all content from DB ───────────────

export async function indexArticles(): Promise<number> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { id: true, title: true, content: true, tags: true, topicId: true },
    take: 500,
  });

  for (const article of articles) {
    await indexContent("article", article.id, article.title, article.content, {
      tags: article.tags,
      topicId: article.topicId,
    });
  }

  return articles.length;
}

export async function indexTopics(): Promise<number> {
  const topics = await prisma.topic.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { id: true, name: true, description: true, category: true },
  });

  for (const topic of topics) {
    await indexContent("topic", topic.id, topic.name, topic.description || "", {
      category: topic.category,
    });
  }

  return topics.length;
}

export async function indexQuestions(): Promise<number> {
  const questions = await prisma.question.findMany({
    select: { id: true, title: true, content: true, difficulty: true, topicId: true },
    take: 1000,
  });

  for (const q of questions) {
    await indexContent("question", q.id, q.title, q.content || "", {
      difficulty: q.difficulty,
      topicId: q.topicId,
    });
  }

  return questions.length;
}
