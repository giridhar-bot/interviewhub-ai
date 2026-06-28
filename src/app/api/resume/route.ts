import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import {
  getUserResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  addSkill,
  addProject,
  addWorkExperience,
  addEducation,
  saveResumeVersion,
} from "@/services/resume-builder.service";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(100),
  template: z.string().optional(),
  summary: z.string().optional(),
});

// GET /api/resume
export async function GET(request: NextRequest) {
  const user = await requireAuth();
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");

  if (id) {
    const resume = await getResume(id, user.id);
    if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(resume);
  }

  return NextResponse.json(await getUserResumes(user.id));
}

// POST /api/resume
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  // Create resume
  if (!body.action || body.action === "create") {
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid" }, { status: 400 });
    }
    const resume = await createResume(user.id, parsed.data);
    return NextResponse.json(resume, { status: 201 });
  }

  // Add sections
  const resumeId = body.resumeId;
  if (!resumeId) return NextResponse.json({ error: "Missing resumeId" }, { status: 400 });

  switch (body.action) {
    case "add-skill":
      return NextResponse.json(await addSkill(resumeId, body));
    case "add-project":
      return NextResponse.json(await addProject(resumeId, body));
    case "add-experience":
      return NextResponse.json(
        await addWorkExperience(resumeId, {
          ...body,
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : undefined,
        })
      );
    case "add-education":
      return NextResponse.json(
        await addEducation(resumeId, {
          ...body,
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : undefined,
        })
      );
    case "save-version":
      return NextResponse.json(await saveResumeVersion(resumeId));
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

// PUT /api/resume
export async function PUT(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const resume = await updateResume(id, user.id, data);
  return NextResponse.json(resume);
}

// DELETE /api/resume
export async function DELETE(request: NextRequest) {
  const user = await requireAuth();
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteResume(id, user.id);
  return NextResponse.json({ success: true });
}
