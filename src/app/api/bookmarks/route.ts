import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import {
  toggleBookmark,
  getUserBookmarks,
  isBookmarked,
  createCollection,
  getUserCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addToCollection,
  removeFromCollection,
} from "@/services/bookmark.service";
import { z } from "zod";

const bookmarkSchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
});

const collectionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

const collectionItemSchema = z.object({
  collectionId: z.string().uuid(),
  entityType: z.string().min(1),
  entityId: z.string().uuid(),
});

// GET /api/bookmarks
export async function GET(request: NextRequest) {
  const user = await requireAuth();
  const { searchParams } = request.nextUrl;
  const action = searchParams.get("action");

  if (action === "check") {
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");
    if (!entityType || !entityId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }
    const result = await isBookmarked(user.id, entityType, entityId);
    return NextResponse.json({ bookmarked: result });
  }

  if (action === "collections") {
    const collections = await getUserCollections(user.id);
    return NextResponse.json(collections);
  }

  if (action === "collection") {
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const collection = await getCollection(id, user.id);
    return NextResponse.json(collection);
  }

  const bookmarks = await getUserBookmarks(
    user.id,
    searchParams.get("entityType") || undefined,
    Number(searchParams.get("page")) || 1,
    Number(searchParams.get("limit")) || 20
  );
  return NextResponse.json(bookmarks);
}

// POST /api/bookmarks
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  // Toggle bookmark
  if (body.action === "toggle" || !body.action) {
    const parsed = bookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const result = await toggleBookmark(user.id, parsed.data.entityType, parsed.data.entityId);
    return NextResponse.json(result);
  }

  // Create collection
  if (body.action === "create-collection") {
    const parsed = collectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const collection = await createCollection(user.id, parsed.data);
    return NextResponse.json(collection, { status: 201 });
  }

  // Add to collection
  if (body.action === "add-to-collection") {
    const parsed = collectionItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    const item = await addToCollection(
      parsed.data.collectionId,
      user.id,
      parsed.data.entityType,
      parsed.data.entityId
    );
    return NextResponse.json(item, { status: 201 });
  }

  // Remove from collection
  if (body.action === "remove-from-collection") {
    const parsed = collectionItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    await removeFromCollection(
      parsed.data.collectionId,
      user.id,
      parsed.data.entityType,
      parsed.data.entityId
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// PUT /api/bookmarks — Update collection
export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const collection = await updateCollection(id, user.id, data);
  return NextResponse.json(collection);
}

// DELETE /api/bookmarks — Delete collection
export async function DELETE(request: NextRequest) {
  const user = await requireAuth();
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteCollection(id, user.id);
  return NextResponse.json({ success: true });
}
