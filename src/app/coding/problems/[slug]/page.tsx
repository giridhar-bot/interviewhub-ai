import { auth } from "@/lib/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { generateCodingProblemSEO } from "@/lib/seo";
import { getProblem, getProblems, getUserSubmissions } from "@/services/coding.service";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const difficultyColors: Record<string, string> = {
  EASY: "text-green-600 bg-green-50",
  MEDIUM: "text-yellow-600 bg-yellow-50",
  HARD: "text-red-600 bg-red-50",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const problem = await getProblem(slug);

  if (!problem) return { title: "Problem Not Found" };

  return generateCodingProblemSEO({
    title: problem.title,
    slug,
    difficulty: problem.difficulty,
    tags: problem.tags,
  });
}

export default async function CodingProblemPage({ params }: Props) {
  const { slug } = await params;
  const problem = await getProblem(slug);

  if (!problem) notFound();

  const [relatedResult, session] = await Promise.all([
    getProblems({ category: problem.category, limit: 6 }),
    auth(),
  ]);
  const relatedProblems = relatedResult.problems.filter((item) => item.slug !== problem.slug).slice(0, 4);
  const submissions = session?.user?.id
    ? await getUserSubmissions(session.user.id, problem.id, 1, 10)
    : [];
  const constraints = problem.constraints?.split(/\r?\n/).filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Coding", href: "/coding" },
              { name: "Problems", href: "/coding/problems" },
              { name: problem.title, href: `/coding/problems/${slug}` },
            ])
          ),
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">{problem.title}</h1>
            <Badge className={difficultyColors[problem.difficulty]}>{problem.difficulty}</Badge>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Acceptance: {problem.acceptance.toFixed(1)}%</span>
            <span>Submissions: {problem._count.submissions.toLocaleString()}</span>
          </div>

          <Separator className="my-6" />
          <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-line">
            {problem.description}
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Examples</h2>
            {problem.testCases.length ? (
              <div className="mt-4 space-y-4">
                {problem.testCases.map((testCase, index) => (
                  <Card key={testCase.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">Example {index + 1}</CardTitle>
                      <div className="mt-2 space-y-1 rounded-lg bg-muted/50 p-3 font-mono text-sm">
                        <div><span className="text-muted-foreground">Input: </span>{testCase.input}</div>
                        <div><span className="text-muted-foreground">Output: </span>{testCase.expected}</div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                No public examples are available for this problem.
              </p>
            )}
          </section>

          {constraints.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold">Constraints</h2>
              <ul className="mt-4 list-disc space-y-1 pl-6 font-mono text-sm">
                {constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
              </ul>
            </section>
          )}

          <section className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
                <CardDescription>Select your language and write your solution below.</CardDescription>
              </CardHeader>
              <div className="border-t p-6">
                <textarea
                  aria-label="Code solution"
                  className="min-h-72 w-full resize-y rounded-lg border bg-background p-4 font-mono text-sm"
                  placeholder="Write your solution"
                />
                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline">Run Code</Button>
                  <Button>Submit Solution</Button>
                </div>
              </div>
            </Card>
          </section>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Problem Info</CardTitle>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Difficulty</span><span>{problem.difficulty}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{problem.category}</span></div>
              {problem.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
              {problem.problemCompanies.length > 0 && (
                <>
                  <Separator />
                  <div className="text-muted-foreground">Companies</div>
                  <div className="flex flex-wrap gap-2">
                    {problem.problemCompanies.map(({ company }) => (
                      <Link key={company.slug} href={`/companies/${company.slug}`}>
                        <Badge variant="secondary">{company.name}</Badge>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Related Problems</CardTitle>
            </CardHeader>
            <div className="space-y-2 px-6 pb-6">
              {relatedProblems.length ? relatedProblems.map((related) => (
                <Link
                  key={related.slug}
                  href={`/coding/problems/${related.slug}`}
                  className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm">{related.title}</span>
                  <span className="text-xs text-muted-foreground">{related.difficulty}</span>
                </Link>
              )) : <p className="text-sm text-muted-foreground">No related problems yet.</p>}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your Submissions</CardTitle>
              <CardDescription>
                {session?.user ? "Your recent attempts for this problem." : "Sign in to view your submission history."}
              </CardDescription>
            </CardHeader>
            {session?.user && (
              <div className="space-y-2 px-6 pb-6 text-sm">
                {submissions.length ? submissions.map((submission) => (
                  <div key={submission.id} className="flex justify-between gap-2">
                    <span>{submission.status.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground">
                      {submission.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                    </span>
                  </div>
                )) : <p className="text-muted-foreground">No submissions yet.</p>}
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}