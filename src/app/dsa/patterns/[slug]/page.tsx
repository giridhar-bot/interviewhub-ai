import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getProblemTags, getProblems } from "@/services/coding.service";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const difficultyColors: Record<string, string> = {
  EASY: "text-green-600 bg-green-50",
  MEDIUM: "text-yellow-600 bg-yellow-50",
  HARD: "text-red-600 bg-red-50",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tags = await getProblemTags();
  const tag = tags.find((item) => toSlug(item.name) === slug);
  const name = tag?.name ?? slug.replace(/-/g, " ");

  return generateSEO({
    title: `${name} Pattern — Practice Problems`,
    description: `Coding problems tagged ${name}.`,
    path: `/dsa/patterns/${slug}`,
  });
}

export default async function DSAPatternPage({ params }: Props) {
  const { slug } = await params;
  const tags = await getProblemTags();
  const pattern = tags.find((tag) => toSlug(tag.name) === slug);

  if (!pattern) notFound();

  const [problemResult, relatedPatterns] = await Promise.all([
    getProblems({ tag: pattern.name, limit: 50 }),
    Promise.resolve(tags.filter((tag) => tag.name !== pattern.name).slice(0, 5)),
  ]);
  const problems = problemResult.problems;
  const difficulties = [...new Set(problems.map((problem) => problem.difficulty))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "DSA", href: "/dsa" },
              { name: "Patterns", href: "/dsa/patterns" },
              { name: pattern.name, href: `/dsa/patterns/${slug}` },
            ])
          ),
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{pattern.name} Pattern</h1>
          <p className="mt-2 text-muted-foreground">
            Practice published coding problems tagged with this pattern.
          </p>

          <Separator className="my-6" />

          <section>
            <h2 className="text-xl font-bold">Practice Problems ({problemResult.total})</h2>
            {problems.length ? (
              <div className="mt-4 overflow-hidden rounded-xl border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Acceptance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((problem) => (
                      <tr key={problem.id} className="border-b last:border-0">
                        <td className="px-6 py-4">
                          <Link href={`/coding/problems/${problem.slug}`} className="font-medium hover:text-primary">
                            {problem.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{problem.acceptance.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                No published coding problems are tagged with this pattern yet.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pattern Info</CardTitle>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Published Problems</span>
                <span>{problemResult.total}</span>
              </div>
              <Separator />
              <div className="text-muted-foreground">Difficulties in this set</div>
              <div className="flex flex-wrap gap-2">
                {difficulties.length ? difficulties.map((difficulty) => (
                  <Badge key={difficulty} variant="outline">{difficulty}</Badge>
                )) : <span>None yet</span>}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Other Problem Tags</CardTitle>
            </CardHeader>
            <div className="space-y-2 px-6 pb-6">
              {relatedPatterns.length ? relatedPatterns.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/dsa/patterns/${toSlug(tag.name)}`}
                  className="block rounded-lg p-2 text-sm transition-colors hover:bg-muted/50"
                >
                  {tag.name} ({tag.count})
                </Link>
              )) : <p className="text-sm text-muted-foreground">No other problem tags yet.</p>}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}