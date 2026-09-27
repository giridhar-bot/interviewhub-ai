import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getProblemCategories, getProblems } from "@/services/coding.service";

export const metadata = generateSEO({
  title: "Coding Problems — Practice DSA & Interview Questions",
  description: "Browse published coding problems by difficulty and category.",
  path: "/coding/problems",
  keywords: ["coding problems", "DSA practice", "interview coding"],
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ difficulty?: string; category?: string }>;
type Difficulty = "EASY" | "MEDIUM" | "HARD";

const difficultyOptions: Array<{ value: Difficulty; label: string; color: string }> = [
  { value: "EASY", label: "Easy", color: "text-green-600" },
  { value: "MEDIUM", label: "Medium", color: "text-yellow-600" },
  { value: "HARD", label: "Hard", color: "text-red-600" },
];

const difficultyColors: Record<Difficulty, string> = {
  EASY: "text-green-600 bg-green-50",
  MEDIUM: "text-yellow-600 bg-yellow-50",
  HARD: "text-red-600 bg-red-50",
};

function parseDifficulty(value?: string): Difficulty | undefined {
  return value === "EASY" || value === "MEDIUM" || value === "HARD" ? value : undefined;
}

export default async function CodingProblemsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { difficulty: requestedDifficulty, category } = await searchParams;
  const difficulty = parseDifficulty(requestedDifficulty);
  const [categories, easy, medium, hard, problemResult] = await Promise.all([
    getProblemCategories(),
    getProblems({ difficulty: "EASY", limit: 1 }),
    getProblems({ difficulty: "MEDIUM", limit: 1 }),
    getProblems({ difficulty: "HARD", limit: 1 }),
    getProblems({ category, difficulty, limit: 50 }),
  ]);
  const difficultyCounts: Record<Difficulty, number> = {
    EASY: easy.total,
    MEDIUM: medium.total,
    HARD: hard.total,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Coding", href: "/coding" },
              { name: "Problems", href: "/coding/problems" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Coding <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Problems</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published problems organized by category and difficulty.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4">
        {difficultyOptions.map((option) => (
          <Link key={option.value} href={`/coding/problems?difficulty=${option.value}`}>
            <Card className="cursor-pointer text-center transition-all hover:shadow-md hover:border-primary/40">
              <CardHeader>
                <CardTitle className={`text-3xl font-bold ${option.color}`}>
                  {difficultyCounts[option.value]}
                </CardTitle>
                <CardDescription>{option.label} Problems</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Browse by Topic</h2>
        {categories.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => (
              <Link key={item.name} href={`/coding/problems?category=${encodeURIComponent(item.name)}`}>
                <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/40">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                    <Badge variant="secondary">{item.count}</Badge>
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
          <h2 className="text-2xl font-bold">
            {category ? `${category} Problems` : "Published Problems"}
          </h2>
          {(category || difficulty) && <Link href="/coding/problems" className="text-sm text-primary">Clear filters</Link>}
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
                    <td className="px-6 py-4"><Badge variant="outline">{problem.category}</Badge></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
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
            No published coding problems match these filters.
          </p>
        )}
      </section>
    </div>
  );
}