import { NextRequest, NextResponse } from "next/server";
import { requireAuth, getCurrentUser } from "@/lib/auth-guard";
import {
  getCompanyProfile,
  getCompanies,
  getCompanyQuestions,
  getCompanyExperiences,
  getCompanySalaries,
  createExperience,
  submitSalary,
  getUserPrepPlan,
  createPrepPlan,
} from "@/services/company-prep.service";
import { z } from "zod";

const experienceSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(50),
  companyId: z.string().uuid(),
  role: z.string().min(1),
  result: z.enum(["SELECTED", "REJECTED", "IN_PROGRESS", "WAITLISTED"]),
  rounds: z.number().int().min(1),
  yoe: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
});

const salarySchema = z.object({
  companyId: z.string().uuid(),
  role: z.string().min(1),
  level: z.string().optional(),
  baseSalary: z.number().optional(),
  totalComp: z.number().optional(),
  currency: z.string().optional(),
  location: z.string().optional(),
  yoe: z.number().int().optional(),
});

// GET /api/companies
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const action = searchParams.get("action");

  if (slug) {
    const company = await getCompanyProfile(slug);
    if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(company);
  }

  if (action === "questions") {
    const companyId = searchParams.get("companyId");
    if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
    const questions = await getCompanyQuestions(companyId, {
      type: (searchParams.get("type") as "THEORY" | "CODING" | "SYSTEM_DESIGN" | "BEHAVIORAL" | "HR") || undefined,
      difficulty: (searchParams.get("difficulty") as "EASY" | "MEDIUM" | "HARD") || undefined,
      topicId: searchParams.get("topicId") || undefined,
      page: Number(searchParams.get("page")) || 1,
    });
    return NextResponse.json(questions);
  }

  if (action === "experiences") {
    const companyId = searchParams.get("companyId");
    if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
    return NextResponse.json(await getCompanyExperiences(companyId));
  }

  if (action === "salaries") {
    const companyId = searchParams.get("companyId");
    if (!companyId) return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
    return NextResponse.json(await getCompanySalaries(companyId));
  }

  if (action === "prep-plan") {
    const user = await requireAuth();
    return NextResponse.json(await getUserPrepPlan(user.id));
  }

  const companies = await getCompanies({
    industry: searchParams.get("industry") || undefined,
    search: searchParams.get("search") || undefined,
    page: Number(searchParams.get("page")) || 1,
  });
  return NextResponse.json(companies);
}

// POST /api/companies — Submit experience, salary, or prep plan
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const body = await request.json();

  if (body.action === "experience") {
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const exp = await createExperience({ ...parsed.data, authorId: user.id });
    return NextResponse.json(exp, { status: 201 });
  }

  if (body.action === "salary") {
    const parsed = salarySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const salary = await submitSalary({ ...parsed.data, userId: user.id });
    return NextResponse.json(salary, { status: 201 });
  }

  if (body.action === "prep-plan") {
    const plan = await createPrepPlan({
      userId: user.id,
      companyId: body.companyId,
      targetRole: body.targetRole,
      durationWeeks: body.durationWeeks || 4,
      plan: body.plan || {},
    });
    return NextResponse.json(plan, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
