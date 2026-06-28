import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { getContests, getContest, getContestLeaderboard } from "@/services/coding.service";

// GET /api/coding/contests
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const action = searchParams.get("action");

  if (action === "leaderboard") {
    const contestId = searchParams.get("contestId");
    if (!contestId) return NextResponse.json({ error: "Missing contestId" }, { status: 400 });
    return NextResponse.json(await getContestLeaderboard(contestId));
  }

  if (slug) {
    const contest = await getContest(slug);
    if (!contest) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(contest);
  }

  const status = (searchParams.get("status") as "upcoming" | "active" | "past") || undefined;
  return NextResponse.json(await getContests(status));
}
