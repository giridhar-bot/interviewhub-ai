// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Community Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";

export const communityRepository = {
  // ── Posts ───────────────────────────────────
  async findPosts(page = 1, limit = 20, tag?: string) {
    const where = {
      status: "PUBLISHED" as const,
      deletedAt: null,
      ...(tag ? { tags: { has: tag } } : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { id: true, displayName: true, avatar: true, username: true } },
          _count: { select: { comments: true, votes: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total, page, totalPages: Math.ceil(total / limit) };
  },

  async findPostBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug, deletedAt: null },
      include: {
        author: { select: { id: true, displayName: true, avatar: true, username: true } },
        comments: {
          where: { parentId: null, deletedAt: null },
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, displayName: true, avatar: true } },
            replies: {
              include: {
                author: { select: { id: true, displayName: true, avatar: true } },
              },
            },
            _count: { select: { votes: true } },
          },
        },
        _count: { select: { votes: true } },
      },
    });
  },

  async createPost(data: { title: string; slug: string; content: string; authorId: string; tags?: string[] }) {
    return prisma.post.create({ data });
  },

  // ── Comments ────────────────────────────────
  async createComment(data: {
    content: string;
    authorId: string;
    postId?: string;
    articleId?: string;
    parentId?: string;
  }) {
    return prisma.comment.create({ data });
  },

  // ── Votes ───────────────────────────────────
  async vote(userId: string, value: number, target: { postId?: string; commentId?: string }) {
    if (target.postId) {
      return prisma.vote.upsert({
        where: { userId_postId: { userId, postId: target.postId } },
        update: { value },
        create: { userId, postId: target.postId, value },
      });
    }
    if (target.commentId) {
      return prisma.vote.upsert({
        where: { userId_commentId: { userId, commentId: target.commentId } },
        update: { value },
        create: { userId, commentId: target.commentId, value },
      });
    }
  },

  // ── Follow ──────────────────────────────────
  async follow(followerId: string, followingId: string) {
    return prisma.follow.create({ data: { followerId, followingId } });
  },

  async unfollow(followerId: string, followingId: string) {
    return prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
  },

  // ── Bookmarks ───────────────────────────────
  async bookmark(userId: string, entityType: string, entityId: string) {
    return prisma.bookmark.upsert({
      where: { userId_entityType_entityId: { userId, entityType, entityId } },
      update: {},
      create: { userId, entityType, entityId },
    });
  },

  async removeBookmark(userId: string, entityType: string, entityId: string) {
    return prisma.bookmark.delete({
      where: { userId_entityType_entityId: { userId, entityType, entityId } },
    });
  },

  async getBookmarks(userId: string, entityType?: string) {
    return prisma.bookmark.findMany({
      where: { userId, ...(entityType ? { entityType } : {}) },
      orderBy: { createdAt: "desc" },
    });
  },
};
