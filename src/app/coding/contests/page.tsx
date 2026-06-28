import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Coding Contests — Weekly Challenges & Competitions",
  description:
    "Participate in weekly coding contests, compete with developers worldwide, and climb the leaderboard. Win badges and XP.",
  path: "/coding/contests",
  keywords: ["coding contests", "programming competition", "weekly challenge", "competitive programming"],
});

const upcomingContests = [
  { title: "Weekly Challenge #42", slug: "weekly-42", startDate: "2025-02-01T10:00:00Z", duration: "2 hours", problems: 4, participants: 0, status: "upcoming" },
  { title: "Bi-Weekly Contest #21", slug: "biweekly-21", startDate: "2025-02-08T10:00:00Z", duration: "2.5 hours", problems: 5, participants: 0, status: "upcoming" },
];

const pastContests = [
  { title: "Weekly Challenge #41", slug: "weekly-41", startDate: "2025-01-25T10:00:00Z", duration: "2 hours", problems: 4, participants: 1240, status: "past" },
  { title: "Weekly Challenge #40", slug: "weekly-40", startDate: "2025-01-18T10:00:00Z", duration: "2 hours", problems: 4, participants: 1180, status: "past" },
  { title: "Bi-Weekly Contest #20", slug: "biweekly-20", startDate: "2025-01-11T10:00:00Z", duration: "2.5 hours", problems: 5, participants: 980, status: "past" },
  { title: "Weekly Challenge #39", slug: "weekly-39", startDate: "2025-01-04T10:00:00Z", duration: "2 hours", problems: 4, participants: 1050, status: "past" },
];

export default function CodingContestsPage() {
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
          Coding{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Contests
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Test your skills in timed competitions. Earn XP, badges, and climb the leaderboard.
        </p>
      </div>

      {/* Upcoming Contests */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Upcoming Contests</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {upcomingContests.map((contest) => (
            <Link key={contest.slug} href={`/coding/contests/${contest.slug}`}>
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-violet-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{contest.title}</CardTitle>
                    <Badge className="bg-green-50 text-green-600">Upcoming</Badge>
                  </div>
                  <CardDescription className="mt-2">
                    {new Date(contest.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{contest.duration}</span>
                    <span>{contest.problems} problems</span>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full">Register Now</Button>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Past Contests */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Past Contests</h2>
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
              {pastContests.map((c) => (
                <tr key={c.slug} className="cursor-pointer border-b transition-colors hover:bg-muted/30 last:border-0">
                  <td className="px-6 py-4">
                    <Link href={`/coding/contests/${c.slug}`} className="font-medium hover:text-violet-600">
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(c.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.duration}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.participants.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
