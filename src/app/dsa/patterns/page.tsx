import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Algorithm Patterns — Master Problem-Solving Techniques",
  description:
    "Learn the most important algorithm patterns for coding interviews. Two pointers, sliding window, BFS/DFS, DP, and more with curated problems.",
  path: "/dsa/patterns",
  keywords: ["algorithm patterns", "coding patterns", "problem solving", "interview techniques"],
});

const patterns = [
  { name: "Two Pointers", count: 30, difficulty: "Easy-Medium", description: "Traverse from both ends or use fast/slow pointers to solve array problems efficiently.", slug: "two-pointers" },
  { name: "Sliding Window", count: 25, difficulty: "Medium", description: "Maintain a dynamic window over array/string to find optimal subarrays.", slug: "sliding-window" },
  { name: "Binary Search", count: 20, difficulty: "Easy-Hard", description: "Search in sorted spaces. Includes search on answer and rotated arrays.", slug: "binary-search" },
  { name: "BFS / DFS", count: 35, difficulty: "Medium-Hard", description: "Graph and tree traversal. Level-order, connected components, topological sort.", slug: "bfs-dfs" },
  { name: "Dynamic Programming", count: 40, difficulty: "Medium-Hard", description: "Break problems into overlapping subproblems. Memoization and tabulation approaches.", slug: "dynamic-programming" },
  { name: "Greedy", count: 15, difficulty: "Medium", description: "Make locally optimal choices. Activity selection, interval scheduling, Huffman.", slug: "greedy" },
  { name: "Backtracking", count: 18, difficulty: "Medium-Hard", description: "Explore all possibilities with pruning. Permutations, combinations, N-Queens.", slug: "backtracking" },
  { name: "Divide & Conquer", count: 12, difficulty: "Medium", description: "Break into subproblems, solve recursively, combine. Merge sort, quick select.", slug: "divide-conquer" },
  { name: "Monotonic Stack", count: 10, difficulty: "Medium", description: "Find next greater/smaller elements efficiently. Stock span, histogram problems.", slug: "monotonic-stack" },
  { name: "Union Find", count: 10, difficulty: "Medium-Hard", description: "Disjoint set operations. Connected components, cycle detection, MST.", slug: "union-find" },
  { name: "Topological Sort", count: 8, difficulty: "Medium", description: "Order nodes in DAG. Course schedule, build systems, dependency resolution.", slug: "topological-sort" },
  { name: "Bit Manipulation", count: 12, difficulty: "Easy-Hard", description: "XOR tricks, bit masking, counting bits. Power of two, single number.", slug: "bit-manipulation" },
];

export default function DSAPatternsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "DSA", href: "/dsa" },
              { name: "Patterns", href: "/dsa/patterns" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Algorithm{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Patterns
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Master the core patterns that appear in 90% of coding interviews.
          Each pattern includes theory, templates, and practice problems.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <Link key={pattern.slug} href={`/dsa/patterns/${pattern.slug}`}>
            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-violet-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{pattern.name}</CardTitle>
                  <Badge variant="secondary">{pattern.count}</Badge>
                </div>
                <CardDescription className="mt-2">{pattern.description}</CardDescription>
                <Badge variant="outline" className="mt-3 w-fit text-xs">
                  {pattern.difficulty}
                </Badge>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
