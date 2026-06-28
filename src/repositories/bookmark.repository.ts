// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Bookmark Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const bookmarkRepository = {
  async findByUser(userId: string, page = 1, limit = 20) {
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);
    return { bookmarks, total, page, totalPages: Math.ceil(total / limit) };
  },

  async toggle(userId: string, entityType: string, entityId: string) {
    const existing = await prisma.bookmark.findFirst({
      where: { userId, entityType, entityId },
    });
    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return { bookmarked: false };
    }
    await prisma.bookmark.create({ data: { userId, entityType, entityId } });
    return { bookmarked: true };
  },

  async getCollections(userId: string) {
    return prisma.collection.findMany({
      where: { userId },
      include: { _count: { select: { items: true } } },
      orderBy: { updatedAt: "desc" },
    });
  },
};
