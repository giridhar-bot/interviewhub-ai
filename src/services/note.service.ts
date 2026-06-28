// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Notes Service (Article CRUD + MDX)
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getCache, setCache, deleteCache } from "@/lib/redis";
import { estimateReadTime, stripMarkdown } from "@/lib/mdx";

// ─── List Notes (Articles) ──────────────────

export async function getNotes(options: {
  topicId?: string;
  subTopicId?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}) {
  const { topicId, subTopicId, status = "PUBLISHED", search, tags, page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const where: Prisma.ArticleWhereInput = {
    status,
    deletedAt: null,
    ...(topicId && { topicId }),
    ...(subTopicId && { subTopicId }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(tags?.length && { tags: { hasSome: tags } }),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        topic: { select: { id: true, name: true, slug: true } },
        subTopic: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total, pages: Math.ceil(total / limit), page };
}

// ─── Get Single Note ────────────────────────

export async function getNote(slug: string) {
  const cacheKey = `note:${slug}`;
  const cached = await getCache<Awaited<ReturnType<typeof fetchNote>>>(cacheKey);
  if (cached) return cached;

  const note = await fetchNote(slug);
  if (note) await setCache(cacheKey, note, 1800);
  return note;
}

async function fetchNote(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      subTopic: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, name: true, image: true } },
      versions: { orderBy: { version: "desc" }, take: 5 },
    },
  });

  if (article) {
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });
  }

  return article;
}

// ─── Create Note ────────────────────────────

export async function createNote(data: {
  title: string;
  slug: string;
  content: string;
  topicId: string;
  subTopicId?: string;
  authorId: string;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED";
}) {
  const readTime = estimateReadTime(data.content);
  const excerpt = stripMarkdown(data.content, 200);

  const article = await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt,
      topicId: data.topicId,
      subTopicId: data.subTopicId,
      authorId: data.authorId,
      tags: data.tags || [],
      readTime,
      status: data.status || "DRAFT",
      createdBy: data.authorId,
    },
  });

  // Create initial version
  await prisma.articleVersion.create({
    data: {
      articleId: article.id,
      title: article.title,
      content: article.content,
      version: 1,
      authorId: data.authorId,
    },
  });

  return article;
}

// ─── Update Note ────────────────────────────

export async function updateNote(
  id: string,
  data: {
    title?: string;
    content?: string;
    tags?: string[];
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    subTopicId?: string;
  },
  updatedBy: string
) {
  const current = await prisma.article.findUnique({
    where: { id },
    include: { versions: { orderBy: { version: "desc" }, take: 1 } },
  });
  if (!current) throw new Error("Note not found");

  const updateData: Prisma.ArticleUpdateInput = {
    updatedBy,
    ...(data.title && { title: data.title }),
    ...(data.tags && { tags: data.tags }),
    ...(data.status && { status: data.status }),
    ...(data.subTopicId && { subTopicId: data.subTopicId }),
  };

  if (data.content) {
    updateData.content = data.content;
    updateData.readTime = estimateReadTime(data.content);
    updateData.excerpt = stripMarkdown(data.content, 200);
  }

  if (data.status === "PUBLISHED" && current.status !== "PUBLISHED") {
    updateData.publishedAt = new Date();
  }

  const article = await prisma.article.update({
    where: { id },
    data: updateData,
  });

  // Save version if content changed
  if (data.content && data.content !== current.content) {
    const nextVersion = (current.versions[0]?.version || 0) + 1;
    await prisma.articleVersion.create({
      data: {
        articleId: id,
        title: data.title || current.title,
        content: data.content,
        version: nextVersion,
        authorId: updatedBy,
      },
    });
  }

  await deleteCache(`note:${current.slug}`);
  return article;
}

// ─── Delete Note (soft) ─────────────────────

export async function deleteNote(id: string) {
  const article = await prisma.article.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
  await deleteCache(`note:${article.slug}`);
  return article;
}

// ─── Get Version History ────────────────────

export async function getNoteVersions(articleId: string) {
  return prisma.articleVersion.findMany({
    where: { articleId },
    orderBy: { version: "desc" },
    include: { author: { select: { name: true, image: true } } },
  });
}

// ─── Restore Version ────────────────────────

export async function restoreVersion(articleId: string, version: number, userId: string) {
  const ver = await prisma.articleVersion.findFirst({
    where: { articleId, version },
  });
  if (!ver) throw new Error("Version not found");

  return updateNote(articleId, { title: ver.title, content: ver.content }, userId);
}
