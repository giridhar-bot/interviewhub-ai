import { semanticSearch, type SearchResult } from "./embeddings";
import { logger } from "@/lib/logger";

// ═══════════════════════════════════════════════
// RAG (Retrieval-Augmented Generation) SERVICE
// ═══════════════════════════════════════════════

export interface RAGContext {
  documents: SearchResult[];
  contextText: string;
  sources: { title: string; type: string; id: string }[];
}

// ─── Query Rewriting ─────────────────────────
// Expand/clarify the user query for better retrieval

export function rewriteQuery(query: string, topicHint?: string): string {
  let rewritten = query.trim();

  // Add topic context if available
  if (topicHint) {
    rewritten = `${topicHint}: ${rewritten}`;
  }

  // Expand common abbreviations
  const expansions: Record<string, string> = {
    "OOP": "Object-Oriented Programming",
    "DSA": "Data Structures and Algorithms",
    "HLD": "High-Level Design",
    "LLD": "Low-Level Design",
    "SOLID": "SOLID principles Single Responsibility Open Closed",
    "REST": "REST API RESTful",
    "SQL": "SQL database queries",
    "CI/CD": "Continuous Integration Continuous Deployment",
    "TDD": "Test-Driven Development",
    "DI": "Dependency Injection",
  };

  for (const [abbr, expansion] of Object.entries(expansions)) {
    if (rewritten.toUpperCase().includes(abbr)) {
      rewritten += ` ${expansion}`;
    }
  }

  return rewritten;
}

// ─── Retrieve Context ────────────────────────

export async function retrieveContext(
  query: string,
  options?: {
    topicHint?: string;
    entityTypes?: string[];
    maxDocuments?: number;
    minSimilarity?: number;
  }
): Promise<RAGContext> {
  const rewritten = rewriteQuery(query, options?.topicHint);

  try {
    const documents = await semanticSearch(
      rewritten,
      options?.entityTypes,
      options?.maxDocuments || 5,
      options?.minSimilarity || 0.7
    );

    // Build context text from retrieved documents
    const contextText = documents
      .map((doc, i) => `[Source ${i + 1}: ${doc.entityType} — ${doc.title}]\n${doc.content}`)
      .join("\n\n---\n\n");

    const sources = documents.map((doc) => ({
      title: doc.title,
      type: doc.entityType,
      id: doc.id,
    }));

    logger.debug("RAG context retrieved", {
      query: query.slice(0, 100),
      documentsFound: documents.length,
      avgSimilarity: documents.length
        ? (documents.reduce((s, d) => s + d.similarity, 0) / documents.length).toFixed(3)
        : 0,
    });

    return { documents, contextText, sources };
  } catch (error) {
    logger.error("RAG retrieval failed", { error, query: query.slice(0, 100) });
    return { documents: [], contextText: "", sources: [] };
  }
}

// ─── Context Compression ─────────────────────
// Reduce context size while preserving relevance

export function compressContext(
  contextText: string,
  maxLength = 4000
): string {
  if (contextText.length <= maxLength) return contextText;

  // Split by document separators and take most relevant (first ones)
  const sections = contextText.split("\n\n---\n\n");
  let compressed = "";

  for (const section of sections) {
    if ((compressed + section).length > maxLength) break;
    compressed += (compressed ? "\n\n---\n\n" : "") + section;
  }

  return compressed || contextText.slice(0, maxLength);
}
