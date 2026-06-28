import { NextRequest, NextResponse } from "next/server";
import { searchSchema } from "@/lib/validations";
import { search } from "@/services/search.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = searchSchema.safeParse({
    q: searchParams.get("q"),
    type: searchParams.get("type") || "all",
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "20",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid search parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const results = await search(parsed.data);
  return NextResponse.json(results);
}
