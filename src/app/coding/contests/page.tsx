import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getContests } from "@/services/coding.service";

export const metadata = generateSEO({
  title: "Coding Contests — Challenges & Competitions",
  description: "Browse published coding contests and their schedules.",
  path: "/coding/contests",
  keywords: ["coding contests", "programming competition", "competitive programming"],
});

export const dynamic = "force-dynamic";

function formatDuration(startTime: Date, endTime: Date) {
  const minutes = Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 60_000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return [hours ? `${hours}h` : "", remainingMinutes ? `${remainingMinutes}m` : ""]
    .filter(Boolean)
    .join(" ") || "0m";
}

export default async function CodingContestsPage() {
  const [upcomingContests, pastContests] = await Promise.all([
    getContests("upcoming"),
    getContests("past"),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Coding", href: "/coding" },
              { name: "Contests", href: "/coding/contests" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Coding <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Contests</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published contests and their schedules.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Upcoming Contests</h2>
        {upcomingContests.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {upcomingContests.map((contest) => (
              <Link key={contest.slug} href={`/coding/contests/${contest.slug}`}>
                <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-violet-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{contest.title}</CardTitle>
                      <Badge className="bg-green-50 text-green-600">Upcoming</Badge>
                    </div>
                    {contest.description && <CardDescription>{contest.description}</CardDescription>}
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{contest.startTime.toLocaleString("en", { dateStyle: "medium", timeStyle: "short" })}</span>
                      <span>{formatDuration(contest.startTime, contest.endTime)}</span>
                      <span>{contest._count.problems} problems</span>
                    </div>
                    <div className="mt-4">
                      <Button className="w-full">View Contest</Button>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No upcoming contests are published.
          </p>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Past Contests</h2>
        {pastContests.length ? (
          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Contest</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Participants</th>
                </tr>
              </thead>
              <tbody>
                {pastContests.map((contest) => (
                  <tr key={contest.slug} className="border-b last:border-0">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/coding/contests/${contest.slug}`} className="hover:text-primary">{contest.title}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {contest.startTime.toLocaleDateString("en", { dateStyle: "medium" })}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDuration(contest.startTime, contest.endTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {contest._count.participants.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No past contests are available.
          </p>
        )}
      </section>
    </div>
  );
}