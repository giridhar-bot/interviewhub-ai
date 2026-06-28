import { NextRequest, NextResponse } from "next/server";
import { getHRQuestions, getSystemDesignQuestions, getQuestion } from "@/services/hr-interview.service";

// GET /api/questions
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  if (slug) {
    const question = await getQuestion(slug);
    if (!question) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(question);
  }

  if (type === "hr" || type === "behavioral") {
    return NextResponse.json(
      await getHRQuestions({
        companyId: searchParams.get("companyId") || undefined,
        difficulty: (searchParams.get("difficulty") as "EASY" | "MEDIUM" | "HARD") || undefined,
        page: Number(searchParams.get("page")) || 1,
      })
    );
  }

  if (type === "system-design") {
    return NextResponse.json(
      await getSystemDesignQuestions({
        companyId: searchParams.get("companyId") || undefined,
        difficulty: (searchParams.get("difficulty") as "EASY" | "MEDIUM" | "HARD") || undefined,
        page: Number(searchParams.get("page")) || 1,
      })
    );
  }

  return NextResponse.json({ error: "Specify type: hr, behavioral, or system-design" }, { status: 400 });
}
