import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

// ═══════════════════════════════════════════════
// INTERNAL LINKING ENGINE
// ═══════════════════════════════════════════════

const CACHE_TTL = 3600; // 1 hour

export interface InternalLink {
  title: string;
  href: string;
  type: "topic" | "article" | "company" | "roadmap" | "cheatsheet" | "coding";
}

// ─── Related Topics ──────────────────────────

export async function getRelatedTopics(
  topicId: string,
  category: string,
  limit = 6
): Promise<InternalLink[]> {
  const cacheKey = `seo:related-topics:${topicId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const topics = await prisma.topic.findMany({
    where: {
      category,
      id: { not: topicId },
      status: "PUBLISHED",
      deletedAt: null,
    },
    select: { name: true, slug: true },
    take: limit,
    orderBy: { order: "asc" },
  });

  const links: InternalLink[] = topics.map((t) => ({
    title: t.name,
    href: `/topics/${t.slug}`,
    type: "topic",
  }));

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(links));
  return links;
}

// ─── Topic → Articles ────────────────────────

export async function getTopicArticles(
  topicId: string,
  limit = 8
): Promise<InternalLink[]> {
  const cacheKey = `seo:topic-articles:${topicId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const articles = await prisma.article.findMany({
    where: {
      topicId,
      status: "PUBLISHED",
      deletedAt: null,
    },
    select: { title: true, slug: true },
    take: limit,
    orderBy: { views: "desc" },
  });

  const links: InternalLink[] = articles.map((a) => ({
    title: a.title,
    href: `/articles/${a.slug}`,
    type: "article",
  }));

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(links));
  return links;
}

// ─── Company → Related Content ───────────────

export async function getCompanyRelatedContent(
  companyId: string
): Promise<{
  experiences: InternalLink[];
  salaries: InternalLink[];
  roles: InternalLink[];
}> {
  const cacheKey = `seo:company-content:${companyId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const [experiences, roles] = await Promise.all([
    prisma.interviewExperience.findMany({
      where: { companyId, status: "PUBLISHED" },
      select: { id: true, title: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.companyRole.findMany({
      where: { companyId },
      select: { id: true, title: true },
      take: 6,
    }),
  ]);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { slug: true },
  });

  const result = {
    experiences: experiences.map((e) => ({
      title: e.title,
      href: `/companies/${company?.slug}/experiences/${e.id}`,
      type: "company" as const,
    })),
    salaries: [] as InternalLink[],
    roles: roles.map((r) => ({
      title: r.title,
      href: `/companies/${company?.slug}/roles/${r.id}`,
      type: "company" as const,
    })),
  };

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  return result;
}

// ─── Article → Navigation (Prev/Next) ────────

export async function getArticleNavigation(
  articleId: string,
  topicId: string
): Promise<{ prev: InternalLink | null; next: InternalLink | null }> {
  const articles = await prisma.article.findMany({
    where: { topicId, status: "PUBLISHED", deletedAt: null },
    select: { id: true, title: true, slug: true },
    orderBy: { createdAt: "asc" },
  });

  const currentIndex = articles.findIndex((a) => a.id === articleId);
  if (currentIndex === -1) return { prev: null, next: null };

  const prev = currentIndex > 0
    ? { title: articles[currentIndex - 1].title, href: `/articles/${articles[currentIndex - 1].slug}`, type: "article" as const }
    : null;

  const next = currentIndex < articles.length - 1
    ? { title: articles[currentIndex + 1].title, href: `/articles/${articles[currentIndex + 1].slug}`, type: "article" as const }
    : null;

  return { prev, next };
}

// ─── Roadmap → Articles Linking ──────────────

export async function getRoadmapArticles(
  roadmapId: string
): Promise<InternalLink[]> {
  const cacheKey = `seo:roadmap-articles:${roadmapId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const steps = await prisma.roadmapStep.findMany({
    where: { roadmapId },
    select: { title: true, resources: true },
    orderBy: { order: "asc" },
  });

  // Steps reference articles; create links from step titles
  const links: InternalLink[] = steps.map((step) => ({
    title: step.title,
    href: `/roadmaps/${roadmapId}#${step.title.toLowerCase().replace(/\s+/g, "-")}`,
    type: "roadmap",
  }));

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(links));
  return links;
}

// ─── Cross-entity linking ────────────────────

export async function getCrossLinks(
  entityType: string,
  tags: string[],
  excludeId: string,
  limit = 6
): Promise<InternalLink[]> {
  if (!tags.length) return [];

  const cacheKey = `seo:cross-links:${entityType}:${tags.join(",")}:${excludeId}`;
  const cached = await redis?.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const links: InternalLink[] = [];

  // Find articles with matching tags
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      id: { not: excludeId },
      tags: { hasSome: tags },
    },
    select: { title: true, slug: true },
    take: limit,
    orderBy: { views: "desc" },
  });

  for (const a of articles) {
    links.push({ title: a.title, href: `/articles/${a.slug}`, type: "article" });
  }

  await redis?.setex(cacheKey, CACHE_TTL, JSON.stringify(links));
  return links;
}

// ─── Auto-link keywords in content ───────────

const KEYWORD_LINK_MAP: Record<string, string> = {
  "Java": "/topics/java",
  "Spring Boot": "/topics/spring-boot",
  "React": "/topics/react",
  "Node.js": "/topics/node-js",
  "TypeScript": "/topics/typescript",
  "JavaScript": "/topics/javascript",
  "Python": "/topics/python",
  "AWS": "/topics/aws",
  "Docker": "/topics/docker",
  "Kubernetes": "/topics/kubernetes",
  "System Design": "/system-design",
  "SQL": "/topics/sql",
  "SAP": "/topics/sap",
  "Angular": "/topics/angular",
  "Vue": "/topics/vue",
  ".NET": "/topics/net",
  "Go": "/topics/go",
  "Azure": "/topics/azure",
  "GCP": "/topics/gcp",
  "Terraform": "/topics/terraform",
};

export function autoLinkKeywords(
  content: string,
  currentPath: string,
  maxLinks = 5
): string {
  let linkCount = 0;
  let result = content;

  for (const [keyword, href] of Object.entries(KEYWORD_LINK_MAP)) {
    if (linkCount >= maxLinks) break;
    if (href === currentPath) continue;

    // Only link first occurrence, avoid linking inside existing links/code
    const regex = new RegExp(`(?<![\\[/\`])\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b(?![\\]\\(\`])`, "i");
    if (regex.test(result)) {
      result = result.replace(regex, `[$1](${href})`);
      linkCount++;
    }
  }

  return result;
}
