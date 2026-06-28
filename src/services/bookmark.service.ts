// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Bookmark & Collections Service
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

// ─── Bookmarks ──────────────────────────────

export async function toggleBookmark(userId: string, entityType: string, entityId: string) {
  const existing = await prisma.bookmark.findUnique({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  await prisma.bookmark.create({
    data: { userId, entityType, entityId },
  });
  return { bookmarked: true };
}

export async function isBookmarked(userId: string, entityType: string, entityId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });
  return !!bookmark;
}

export async function getUserBookmarks(
  userId: string,
  entityType?: string,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit;
  const where = { userId, ...(entityType && { entityType }) };

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.bookmark.count({ where }),
  ]);

  return { bookmarks, total, pages: Math.ceil(total / limit), page };
}

// ─── Collections ────────────────────────────

export async function createCollection(
  userId: string,
  data: { name: string; description?: string; isPublic?: boolean }
) {
  return prisma.collection.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      isPublic: data.isPublic ?? false,
    },
  });
}

export async function getUserCollections(userId: string) {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function getCollection(id: string, userId?: string) {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      items: { orderBy: { order: "asc" } },
      user: { select: { name: true, image: true } },
    },
  });
  if (!collection) throw new Error("Collection not found");
  if (!collection.isPublic && collection.userId !== userId) {
    throw new Error("Not authorized");
  }
  return collection;
}

export async function updateCollection(
  id: string,
  userId: string,
  data: { name?: string; description?: string; isPublic?: boolean }
) {
  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection || collection.userId !== userId) throw new Error("Not authorized");

  return prisma.collection.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
    },
  });
}

export async function deleteCollection(id: string, userId: string) {
  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection || collection.userId !== userId) throw new Error("Not authorized");

  return prisma.collection.delete({ where: { id } });
}

// ─── Collection Items ───────────────────────

export async function addToCollection(
  collectionId: string,
  userId: string,
  entityType: string,
  entityId: string
) {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  if (!collection || collection.userId !== userId) throw new Error("Not authorized");

  const lastItem = await prisma.collectionItem.findFirst({
    where: { collectionId },
    orderBy: { order: "desc" },
  });

  return prisma.collectionItem.create({
    data: {
      collectionId,
      entityType,
      entityId,
      order: (lastItem?.order || 0) + 1,
    },
  });
}

export async function removeFromCollection(
  collectionId: string,
  userId: string,
  entityType: string,
  entityId: string
) {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  if (!collection || collection.userId !== userId) throw new Error("Not authorized");

  return prisma.collectionItem.delete({
    where: {
      collectionId_entityType_entityId: { collectionId, entityType, entityId },
    },
  });
}
