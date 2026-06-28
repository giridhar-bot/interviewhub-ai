import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Coding Practice — DSA & Problem Solving",
  description:
    "Practice data structures and algorithms with 500+ curated problems, online code editor, test cases, and detailed solutions. Prepare for coding interviews at FAANG & top companies.",
  path: "/coding",
  keywords: ["coding practice", "DSA problems", "leetcode alternative", "coding interview", "data structures", "algorithms", "competitive programming"],
});

const categories = [
  { name: "Arrays", count: 120, difficulty: "Easy-Hard" },
  { name: "Strings", count: 85, difficulty: "Easy-Hard" },
  { name: "Linked List", count: 45, difficulty: "Easy-Hard" },
  { name: "Trees", count: 60, difficulty: "Medium-Hard" },
  { name: "Graphs", count: 55, difficulty: "Medium-Hard" },
  { name: "Dynamic Programming", count: 80, difficulty: "Medium-Hard" },
  { name: "Sorting & Searching", count: 40, difficulty: "Easy-Medium" },
  { name: "Stack & Queue", count: 35, difficulty: "Easy-Medium" },
  { name: "Recursion", count: 30, difficulty: "Easy-Hard" },
  { name: "Hashing", count: 45, difficulty: "Easy-Medium" },
  { name: "Greedy", count: 35, difficulty: "Medium-Hard" },
  { name: "Backtracking", count: 25, difficulty: "Medium-Hard" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

const featuredProblems = [
  { title: "Two Sum", difficulty: "Easy", topic: "Arrays", acceptance: "49%" },
  { title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Strings", acceptance: "33%" },
  { title: "Merge K Sorted Lists", difficulty: "Hard", topic: "Linked List", acceptance: "48%" },
  { title: "Binary Tree Level Order", difficulty: "Medium", topic: "Trees", acceptance: "62%" },
  { title: "Climbing Stairs", difficulty: "Easy", topic: "DP", acceptance: "51%" },
  { title: "Word Search", difficulty: "Medium", topic: "Backtracking", acceptance: "40%" },
];

export default function CodingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Coding{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Practice
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Master Data Structures & Algorithms with curated problems organized by
          topic and difficulty.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-3 gap-4 rounded-2xl border bg-card p-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-sm text-muted-foreground">Easy Solved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">0</div>
          <div className="text-sm text-muted-foreground">Medium Solved</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">0</div>
          <div className="text-sm text-muted-foreground">Hard Solved</div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Problem Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/coding/${cat.name.toLowerCase().replace(/[\s&]+/g, "-")}`}>
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-base">{cat.name}</CardTitle>
                    <CardDescription>{cat.count} problems</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {cat.difficulty}
                  </Badge>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Problems */}
      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Problems</h2>
          <Button variant="outline" className="rounded-full">
            View All
          </Button>
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Problem
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Acceptance
                </th>
              </tr>
            </thead>
            <tbody>
              {featuredProblems.map((problem, i) => (
                <tr
                  key={problem.title}
                  className="cursor-pointer border-b transition-colors hover:bg-muted/30 last:border-0"
                >
                  <td className="px-6 py-4 font-medium">{problem.title}</td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="text-xs">
                      {problem.topic}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        difficultyColors[problem.difficulty]
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {problem.acceptance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
