import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Coding Problems — Practice DSA & Interview Questions",
  description:
    "Browse 500+ curated coding problems organized by difficulty, topic, and company. Practice with an online code editor and get detailed solutions.",
  path: "/coding/problems",
  keywords: ["coding problems", "DSA practice", "interview coding", "leetcode alternative"],
});

const difficulties = [
  { label: "Easy", count: 150, color: "text-green-600 bg-green-50", href: "/coding/problems?difficulty=EASY" },
  { label: "Medium", count: 250, color: "text-yellow-600 bg-yellow-50", href: "/coding/problems?difficulty=MEDIUM" },
  { label: "Hard", count: 100, color: "text-red-600 bg-red-50", href: "/coding/problems?difficulty=HARD" },
];

const topics = [
  { name: "Arrays", slug: "arrays", count: 120 },
  { name: "Strings", slug: "strings", count: 85 },
  { name: "Linked List", slug: "linked-list", count: 45 },
  { name: "Trees", slug: "trees", count: 60 },
  { name: "Graphs", slug: "graphs", count: 55 },
  { name: "Dynamic Programming", slug: "dynamic-programming", count: 80 },
  { name: "Sorting & Searching", slug: "sorting-searching", count: 40 },
  { name: "Stack & Queue", slug: "stack-queue", count: 35 },
  { name: "Recursion", slug: "recursion", count: 30 },
  { name: "Hashing", slug: "hashing", count: 45 },
  { name: "Greedy", slug: "greedy", count: 35 },
  { name: "Backtracking", slug: "backtracking", count: 25 },
  { name: "Bit Manipulation", slug: "bit-manipulation", count: 20 },
  { name: "Math", slug: "math", count: 30 },
  { name: "Heap / Priority Queue", slug: "heap", count: 25 },
];

const featuredProblems = [
  { title: "Two Sum", slug: "two-sum", difficulty: "Easy", topic: "Arrays", acceptance: "49%", companies: 15 },
  { title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", topic: "Strings", acceptance: "33%", companies: 12 },
  { title: "Merge K Sorted Lists", slug: "merge-k-sorted-lists", difficulty: "Hard", topic: "Linked List", acceptance: "48%", companies: 8 },
  { title: "Binary Tree Level Order", slug: "binary-tree-level-order", difficulty: "Medium", topic: "Trees", acceptance: "62%", companies: 10 },
  { title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy", topic: "DP", acceptance: "51%", companies: 7 },
  { title: "Word Search", slug: "word-search", difficulty: "Medium", topic: "Backtracking", acceptance: "40%", companies: 6 },
  { title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", topic: "Arrays", acceptance: "36%", companies: 9 },
  { title: "LRU Cache", slug: "lru-cache", difficulty: "Medium", topic: "Design", acceptance: "42%", companies: 14 },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default function CodingProblemsPage() {
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
          Coding{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Problems
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Practice with curated problems organized by topic, difficulty, and company frequency.
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="mt-12 grid grid-cols-3 gap-4">
        {difficulties.map((d) => (
          <Link key={d.label} href={d.href}>
            <Card className="cursor-pointer text-center transition-all hover:shadow-md hover:border-violet-200">
              <CardHeader>
                <CardTitle className={`text-3xl font-bold ${d.color.split(" ")[0]}`}>
                  {d.count}
                </CardTitle>
                <CardDescription>{d.label} Problems</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Topics */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Browse by Topic</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.slug} href={`/coding/problems?category=${topic.slug}`}>
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-sm font-medium">{topic.name}</CardTitle>
                  <Badge variant="secondary">{topic.count}</Badge>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Problems */}
      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Problems</h2>
          <Link href="/coding/problems?sort=popular">
            <Button variant="outline" className="rounded-full">
              View All
            </Button>
          </Link>
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Topic</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {featuredProblems.map((p) => (
                <tr key={p.slug} className="cursor-pointer border-b transition-colors hover:bg-muted/30 last:border-0">
                  <td className="px-6 py-4">
                    <Link href={`/coding/problems/${p.slug}`} className="font-medium hover:text-violet-600">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{p.topic}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.acceptance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
