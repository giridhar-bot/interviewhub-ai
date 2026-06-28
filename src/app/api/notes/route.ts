import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { getNotes, getNote, createNote, updateNote, deleteNote } from "@/services/note.service";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  content: z.string().min(1),
  topicId: z.string().uuid(),
  subTopicId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  subTopicId: z.string().uuid().optional(),
});

// GET /api/notes — List or get single note
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");

  if (slug) {
    const note = await getNote(slug);
    if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(note);
  }

  const notes = await getNotes({
    topicId: searchParams.get("topicId") || undefined,
    subTopicId: searchParams.get("subTopicId") || undefined,
    status: (searchParams.get("status") as "DRAFT" | "PUBLISHED") || "PUBLISHED",
    search: searchParams.get("search") || undefined,
    tags: searchParams.get("tags")?.split(",") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 20,
  });

  return NextResponse.json(notes);
}

// POST /api/notes — Create note (admin/author only)
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!["ADMIN", "SUPER_ADMIN", "AUTHOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const note = await createNote({ ...parsed.data, authorId: user.id });
  return NextResponse.json(note, { status: 201 });
}

// PUT /api/notes — Update note
export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  if (!["ADMIN", "SUPER_ADMIN", "AUTHOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { id, ...data } = parsed.data;
  const note = await updateNote(id, data, user.id);
  return NextResponse.json(note);
}

// DELETE /api/notes — Soft delete note
export async function DELETE(request: NextRequest) {
  const user = await requireAuth();
  if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteNote(id);
  return NextResponse.json({ success: true });
}
