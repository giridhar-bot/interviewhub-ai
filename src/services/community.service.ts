// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Community Service
// Posts, Comments, Votes, Follows, Notifications
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// ─── Posts / Discussions ────────────────────

export async function getPosts(options?: {
  type?: string;
  tag?: string;
  search?: string;
  authorId?: string;
  pinned?: boolean;
  page?: number;
  limit?: number;
  sort?: "latest" | "popular" | "unanswered";
}) {
  const { type, tag, search, authorId, pinned, page = 1, limit = 20, sort = "latest" } = options || {};
  const skip = (page - 1) * limit;

  const where: Prisma.PostWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    ...(type && { type }),
    ...(authorId && { authorId }),
    ...(pinned !== undefined && { pinned }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(tag && { tags: { has: tag } }),
  };

  const orderBy: Prisma.PostOrderByWithRelationInput =
    sort === "popular" ? { views: "desc" } : { createdAt: "desc" };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

export async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: {
        where: { deletedAt: null, parentId: null },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, name: true, image: true } },
          replies: {
            where: { deletedAt: null },
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: { id: true, name: true, image: true } },
            },
          },
          _count: { select: { votes: true } },
        },
      },
      _count: { select: { comments: true, votes: true } },
    },
  });

  if (post) {
    await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  }

  return post;
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  tags?: string[];
}) {
  return prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      authorId: data.authorId,
      tags: data.tags || [],
      status: "PUBLISHED",
    },
  });
}

export async function updatePost(id: string, authorId: string, data: { title?: string; content?: string; tags?: string[] }) {
  const post = await prisma.post.findFirst({ where: { id, authorId } });
  if (!post) throw new Error("Post not found or unauthorized");
  return prisma.post.update({ where: { id }, data });
}

export async function deletePost(id: string, authorId: string) {
  const post = await prisma.post.findFirst({ where: { id, authorId } });
  if (!post) throw new Error("Post not found or unauthorized");
  return prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
}

// ─── Comments ───────────────────────────────

export async function createComment(data: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) {
  return prisma.comment.create({
    data: {
      content: data.content,
      authorId: data.authorId,
      postId: data.postId,
      parentId: data.parentId,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
}

export async function deleteComment(id: string, authorId: string) {
  const comment = await prisma.comment.findFirst({ where: { id, authorId } });
  if (!comment) throw new Error("Comment not found or unauthorized");
  return prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
}

// ─── Votes ──────────────────────────────────

export async function toggleVote(userId: string, targetId: string, targetType: "post" | "comment", value: number) {
  const whereField = targetType === "post" ? "postId" : "commentId";
  const existing = await prisma.vote.findFirst({
    where: { userId, [whereField]: targetId },
  });

  if (existing) {
    if (existing.value === value) {
      await prisma.vote.delete({ where: { id: existing.id } });
      return { action: "removed" };
    }
    await prisma.vote.update({ where: { id: existing.id }, data: { value } });
    return { action: "changed", value };
  }

  await prisma.vote.create({
    data: { userId, [whereField]: targetId, value },
  });
  return { action: "added", value };
}

export async function getVoteCount(targetId: string, targetType: "post" | "comment") {
  const whereField = targetType === "post" ? "postId" : "commentId";
  const result = await prisma.vote.aggregate({
    where: { [whereField]: targetId },
    _sum: { value: true },
  });
  return result._sum.value || 0;
}

// ─── Follow ─────────────────────────────────

export async function toggleFollow(followerId: string, followingId: string) {
  if (followerId === followingId) throw new Error("Cannot follow yourself");

  const existing = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { following: false };
  }

  await prisma.follow.create({ data: { followerId, followingId } });
  return { following: true };
}

export async function getFollowers(userId: string) {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: { select: { id: true, name: true, image: true } } },
  });
}

export async function getFollowing(userId: string) {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: { select: { id: true, name: true, image: true } } },
  });
}

// ─── Notifications ──────────────────────────

export async function getNotifications(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [notifications, total, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);
  return { notifications, total, unread, pages: Math.ceil(total / limit) };
}

export async function markNotificationRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function createNotification(data: {
  userId: string;
  actorId?: string;
  type: "SYSTEM" | "COMMENT" | "VOTE" | "ACHIEVEMENT" | "FOLLOW" | "MENTION" | "STREAK";
  title: string;
  message?: string;
  entityType?: string;
  entityId?: string;
}) {
  return prisma.notification.create({ data: { ...data, read: false } });
}

// ─── Reports / Moderation ───────────────────

export async function reportContent(data: {
  reporterId: string;
  entityType: string;
  entityId: string;
  reason: "SPAM" | "INAPPROPRIATE" | "HARASSMENT" | "COPYRIGHT" | "OTHER";
  description?: string;
  targetId?: string;
}) {
  return prisma.report.create({
    data: {
      reporterId: data.reporterId,
      entityType: data.entityType,
      entityId: data.entityId,
      reason: data.reason,
      description: data.description,
      targetId: data.targetId,
      status: "PENDING",
    },
  });
}

// ─── Tags ───────────────────────────────────

export async function getTrendingTags(limit = 20) {
  return prisma.tag.findMany({
    orderBy: { usageCount: "desc" },
    take: limit,
  });
}
