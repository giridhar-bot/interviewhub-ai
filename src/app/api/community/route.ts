import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getCurrentUser } from "@/lib/auth-guard";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  createComment,
  toggleVote,
  toggleFollow,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  reportContent,
  getTrendingTags,
} from "@/services/community.service";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  content: z.string().min(10),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const commentSchema = z.object({
  content: z.string().min(1).max(5000),
  postId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
});

// GET /api/community
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  switch (action) {
    case "post": {
      const slug = searchParams.get("slug");
      if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
      const post = await getPost(slug);
      if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(post);
    }
    case "tags":
      return NextResponse.json(await getTrendingTags());
    case "notifications": {
      const user = await requireAuth();
      const page = Number(searchParams.get("page")) || 1;
      return NextResponse.json(await getNotifications(user.id, page));
    }
    default: {
      const posts = await getPosts({
        type: searchParams.get("type") || undefined,
        tag: searchParams.get("tag") || undefined,
        search: searchParams.get("search") || undefined,
        page: Number(searchParams.get("page")) || 1,
        limit: Number(searchParams.get("limit")) || 20,
        sort: (searchParams.get("sort") as "latest" | "popular" | "unanswered") || "latest",
      });
      return NextResponse.json(posts);
    }
  }
}

// POST /api/community
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  switch (body.action) {
    case "post": {
      const parsed = postSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid" }, { status: 400 });
      }
      const post = await createPost({ ...parsed.data, authorId: user.id });
      return NextResponse.json(post, { status: 201 });
    }
    case "comment": {
      const parsed = commentSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid" }, { status: 400 });
      }
      const comment = await createComment({ ...parsed.data, authorId: user.id });
      return NextResponse.json(comment, { status: 201 });
    }
    case "vote": {
      const { entityId, entityType, value } = body;
      if (!entityId || !entityType || (value !== 1 && value !== -1)) {
        return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
      }
      const result = await toggleVote(user.id, entityId, entityType, value);
      return NextResponse.json(result);
    }
    case "follow": {
      const { followingId } = body;
      if (!followingId) return NextResponse.json({ error: "Missing followingId" }, { status: 400 });
      const result = await toggleFollow(user.id, followingId);
      return NextResponse.json(result);
    }
    case "report": {
      const { targetId, entityType, entityId, reason, description } = body;
      if (!entityType || !entityId || !reason) {
        return NextResponse.json({ error: "Missing report fields" }, { status: 400 });
      }
      const report = await reportContent({
        reporterId: user.id,
        entityType,
        entityId,
        reason,
        description,
        targetId,
      });
      return NextResponse.json(report, { status: 201 });
    }
    case "mark-read": {
      if (body.all) {
        await markAllNotificationsRead(user.id);
      } else if (body.id) {
        await markNotificationRead(body.id, user.id);
      }
      return NextResponse.json({ success: true });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

// PUT /api/community — Update post
export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const post = await updatePost(id, user.id, data);
  return NextResponse.json(post);
}

// DELETE /api/community
export async function DELETE(request: NextRequest) {
  const user = await requireAuth();
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deletePost(id, user.id);
  return NextResponse.json({ success: true });
}
