import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getContest } from "@/services/coding.service";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function formatDuration(startTime: Date, endTime: Date) {
  const minutes = Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 60_000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return [hours ? `${hours}h` : "", remainingMinutes ? `${remainingMinutes}m` : ""]
    .filter(Boolean)
    .join(" ") || "0m";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const contest = await getContest(slug);

  return generateSEO({
    title: contest ? `Contest: ${contest.title}` : "Contest Not Found",
    description: contest?.description ?? "Published coding contest details.",
    path: `/coding/contests/${slug}`,
  });
}

export default async function ContestDetailPage({ params }: Props) {
  const { slug } = await params;
  const contest = await getContest(slug);

  if (!contest) notFound();

  const now = new Date();
  const state = now < contest.startTime ? "Upcoming" : now < contest.endTime ? "Live" : "Ended";
  const totalPoints = contest.problems.reduce((sum, item) => sum + item.points, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Coding", href: "/coding" },
              { name: "Contests", href: "/coding/contests" },
              { name: contest.title, href: `/coding/contests/${slug}` },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">{contest.title}</h1>
            <Badge variant="outline">{state}</Badge>
          </div>
          {contest.description && <p className="mt-2 text-muted-foreground">{contest.description}</p>}
          <p className="mt-2 text-sm text-muted-foreground">
            {contest.startTime.toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}
            {` – ${contest.endTime.toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}`}
          </p>
        </div>
        <Button size="lg" disabled={state !== "Upcoming"}>Join Contest</Button>
      </div>

      <Separator className="my-8" />

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <section>
          <h2 className="text-xl font-bold">Problems ({contest.problems.length})</h2>
          {contest.problems.length ? (
            <div className="mt-4 space-y-3">
              {contest.problems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                        {item.order + 1}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          <Link href={`/coding/problems/${item.problem.slug}`} className="hover:text-primary">
                            {item.problem.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>{item.points} points</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{item.problem.difficulty}</Badge>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No problems have been added to this contest.
            </p>
          )}
        </section>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contest Info</CardTitle>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{state}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{formatDuration(contest.startTime, contest.endTime)}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Participants</span><span>{contest._count.participants.toLocaleString()}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Total Points</span><span>{totalPoints}</span></div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Leaderboard</CardTitle>
              <CardDescription>Stored contest results</CardDescription>
            </CardHeader>
            <div className="space-y-2 px-6 pb-6 text-sm">
              {contest.leaderboard.length ? contest.leaderboard.map((entry) => (
                <div key={entry.id} className="flex justify-between">
                  <span>#{entry.rank} · {entry.solvedCount} solved</span>
                  <span>{entry.score} pts</span>
                </div>
              )) : <p className="text-muted-foreground">No leaderboard entries yet.</p>}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}