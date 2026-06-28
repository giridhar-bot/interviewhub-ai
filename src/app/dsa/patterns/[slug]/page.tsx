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
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return generateSEO({
    title: `${name} Pattern — Algorithm Problems & Techniques`,
    description: `Learn the ${name} pattern with theory, code templates, and curated practice problems. Master this essential interview technique.`,
    path: `/dsa/patterns/${slug}`,
    keywords: [slug, "algorithm pattern", "coding interview", "DSA"],
  });
}

const sampleProblems = [
  { title: "Problem 1", difficulty: "Easy", status: "solved", slug: "problem-1" },
  { title: "Problem 2", difficulty: "Easy", status: "unsolved", slug: "problem-2" },
  { title: "Problem 3", difficulty: "Medium", status: "unsolved", slug: "problem-3" },
  { title: "Problem 4", difficulty: "Medium", status: "unsolved", slug: "problem-4" },
  { title: "Problem 5", difficulty: "Medium", status: "unsolved", slug: "problem-5" },
  { title: "Problem 6", difficulty: "Hard", status: "unsolved", slug: "problem-6" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default async function DSAPatternPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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
              { name, href: `/dsa/patterns/${slug}` },
            ])
          ),
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {name}{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Pattern
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Learn the core technique, see the template, then practice with curated problems.
          </p>

          <Separator className="my-6" />

          {/* Theory */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Concept</h2>
            <p>
              The {name} pattern is a fundamental algorithmic technique used to solve
              a wide range of problems efficiently. Understanding when and how to apply
              this pattern is crucial for coding interviews.
            </p>
            <h2>When to Use</h2>
            <ul>
              <li>When the problem involves searching in a sorted space</li>
              <li>When you need to optimize from O(n²) to O(n) or O(n log n)</li>
              <li>When the problem has optimal substructure</li>
            </ul>
            <h2>Template</h2>
            <pre className="rounded-lg bg-muted p-4 text-sm">
              <code>{`// Generic ${name} template
function solve(input) {
  // Initialize
  // Process using ${name} technique
  // Return result
}`}</code>
            </pre>
            <h2>Time & Space Complexity</h2>
            <ul>
              <li>Time: Varies by problem (typically O(n) to O(n log n))</li>
              <li>Space: O(1) to O(n) depending on approach</li>
            </ul>
          </div>

          {/* Practice Problems */}
          <div className="mt-8">
            <h2 className="text-xl font-bold">Practice Problems</h2>
            <div className="mt-4 overflow-hidden rounded-xl border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleProblems.map((p) => (
                    <tr key={p.slug} className="cursor-pointer border-b transition-colors hover:bg-muted/30 last:border-0">
                      <td className="px-6 py-4">
                        <Link href={`/coding/problems/${p.slug}`} className="font-medium hover:text-violet-600">
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[p.difficulty]}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={p.status === "solved" ? "default" : "outline"}>
                          {p.status === "solved" ? "Solved" : "Todo"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pattern Info</CardTitle>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Problems</span>
                <span>{sampleProblems.length}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span>Easy - Hard</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Progress</span>
                <span>0/{sampleProblems.length}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Related Patterns</CardTitle>
            </CardHeader>
            <div className="space-y-2 px-6 pb-6">
              {["Two Pointers", "Binary Search", "Sliding Window"].map((p) => (
                <Link
                  key={p}
                  href={`/dsa/patterns/${p.toLowerCase().replace(/\s+/g, "-")}`}
                  className="block rounded-lg p-2 text-sm transition-colors hover:bg-muted/50"
                >
                  {p}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
