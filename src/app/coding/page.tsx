import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getProblemCategories, getProblems, getUserCodingStats } from "@/services/coding.service";

export const metadata = generateSEO({
  title: "Coding Practice — DSA & Problem Solving",
  description: "Practice published data structures and algorithms problems.",
  path: "/coding",
  keywords: ["coding practice", "DSA problems", "coding interview", "data structures", "algorithms"],
});

export const dynamic = "force-dynamic";

const difficultyColors: Record<string, string> = {
  EASY: "text-green-600 bg-green-50",
  MEDIUM: "text-yellow-600 bg-yellow-50",
  HARD: "text-red-600 bg-red-50",
};

export default async function CodingPage() {
  const session = await auth();
  const [categories, problemResult, codingStats] = await Promise.all([
    getProblemCategories(),
    getProblems({ limit: 6 }),
    session?.user?.id ? getUserCodingStats(session.user.id) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Coding <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Practice</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Practice published problems organized by their database category and difficulty.
        </p>
      </div>

      {codingStats && (
        <div className="mt-12 grid grid-cols-3 gap-4 rounded-2xl border bg-card p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{codingStats.difficulty.easy}</div>
            <div className="text-sm text-muted-foreground">Easy Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{codingStats.difficulty.medium}</div>
            <div className="text-sm text-muted-foreground">Medium Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{codingStats.difficulty.hard}</div>
            <div className="text-sm text-muted-foreground">Hard Solved</div>
          </div>
        </div>
      )}

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Problem Categories</h2>
        {categories.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} href={`/coding/problems?category=${encodeURIComponent(category.name)}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <CardDescription>{category.count} published problems</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No published problem categories yet.
          </p>
        )}
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recently Added Problems</h2>
          <Link href="/coding/problems"><Button variant="outline">View All</Button></Link>
        </div>
        {problemResult.problems.length ? (
          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Acceptance</th>
                </tr>
              </thead>
              <tbody>
                {problemResult.problems.map((problem) => (
                  <tr key={problem.id} className="border-b last:border-0">
                    <td className="px-6 py-4 font-medium">
                      <Link href={`/coding/problems/${problem.slug}`} className="hover:text-primary">{problem.title}</Link>
                    </td>
                    <td className="px-6 py-4"><Badge variant="secondary" className="text-xs">{problem.category}</Badge></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{problem.acceptance.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No published coding problems yet.
          </p>
        )}
      </section>
    </div>
  );
}