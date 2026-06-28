import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateSEO({
    title: `Contest: ${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    description: `Join this coding contest and compete with developers worldwide. Solve problems under time pressure and climb the leaderboard.`,
    path: `/coding/contests/${slug}`,
  });
}

const contestProblems = [
  { title: "Array Partition", slug: "array-partition", difficulty: "Easy", points: 100 },
  { title: "Minimum Window Substring", slug: "min-window-substring", difficulty: "Medium", points: 200 },
  { title: "Merge Intervals", slug: "merge-intervals", difficulty: "Medium", points: 200 },
  { title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", points: 300 },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default async function ContestDetailPage({ params }: Props) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
              { name: title, href: `/coding/contests/${slug}` },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">
            Duration: 2 hours • 4 problems • 800 total points
          </p>
        </div>
        <Button size="lg">Join Contest</Button>
      </div>

      <Separator className="my-8" />

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div>
          <h2 className="text-xl font-bold">Problems</h2>
          <div className="mt-4 space-y-3">
            {contestProblems.map((p, i) => (
              <Card key={p.slug} className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <CardTitle className="text-base">{p.title}</CardTitle>
                      <CardDescription>{p.points} points</CardDescription>
                    </div>
                  </div>
                  <Badge className={difficultyColors[p.difficulty]}>{p.difficulty}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contest Info</CardTitle>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge>Upcoming</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>2 hours</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participants</span>
                <span>0 registered</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Leaderboard</CardTitle>
              <CardDescription>Results available after contest ends</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
