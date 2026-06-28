import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "DSA Learning Path — Data Structures & Algorithms Mastery",
  description:
    "Master Data Structures & Algorithms with a structured roadmap. From basics to advanced — arrays, trees, graphs, DP, and more. Prepare for FAANG coding interviews.",
  path: "/dsa",
  keywords: ["DSA", "data structures", "algorithms", "coding interview", "FAANG prep", "competitive programming"],
});

const phases = [
  {
    phase: 1,
    title: "Foundations",
    duration: "2 weeks",
    color: "from-green-500 to-emerald-500",
    topics: [
      { name: "Arrays & Strings", problems: 30, slug: "arrays" },
      { name: "Hashing", problems: 20, slug: "hashing" },
      { name: "Two Pointers", problems: 15, slug: "two-pointers" },
      { name: "Sorting Algorithms", problems: 15, slug: "sorting" },
    ],
  },
  {
    phase: 2,
    title: "Linear Structures",
    duration: "2 weeks",
    color: "from-blue-500 to-cyan-500",
    topics: [
      { name: "Linked Lists", problems: 20, slug: "linked-list" },
      { name: "Stacks", problems: 15, slug: "stacks" },
      { name: "Queues", problems: 10, slug: "queues" },
      { name: "Sliding Window", problems: 15, slug: "sliding-window" },
    ],
  },
  {
    phase: 3,
    title: "Non-Linear Structures",
    duration: "3 weeks",
    color: "from-violet-500 to-purple-500",
    topics: [
      { name: "Binary Trees", problems: 25, slug: "binary-trees" },
      { name: "BST", problems: 15, slug: "bst" },
      { name: "Heaps", problems: 12, slug: "heaps" },
      { name: "Tries", problems: 8, slug: "tries" },
    ],
  },
  {
    phase: 4,
    title: "Advanced Algorithms",
    duration: "3 weeks",
    color: "from-orange-500 to-red-500",
    topics: [
      { name: "Graphs (BFS/DFS)", problems: 30, slug: "graphs" },
      { name: "Dynamic Programming", problems: 40, slug: "dynamic-programming" },
      { name: "Greedy", problems: 15, slug: "greedy" },
      { name: "Backtracking", problems: 15, slug: "backtracking" },
    ],
  },
  {
    phase: 5,
    title: "Expert Level",
    duration: "2 weeks",
    color: "from-pink-500 to-rose-500",
    topics: [
      { name: "Segment Trees", problems: 10, slug: "segment-trees" },
      { name: "Graph Advanced", problems: 15, slug: "graph-advanced" },
      { name: "Bit Manipulation", problems: 12, slug: "bit-manipulation" },
      { name: "Math & Number Theory", problems: 10, slug: "math" },
    ],
  },
];

const patterns = [
  { name: "Two Pointers", problems: 30, description: "Traverse from both ends or use fast/slow pointers", slug: "two-pointers" },
  { name: "Sliding Window", problems: 25, description: "Maintain a window that expands or contracts", slug: "sliding-window" },
  { name: "Binary Search", problems: 20, description: "Search in sorted arrays or answer spaces", slug: "binary-search" },
  { name: "BFS/DFS", problems: 35, description: "Graph and tree traversal techniques", slug: "bfs-dfs" },
  { name: "Dynamic Programming", problems: 40, description: "Optimal substructure and overlapping subproblems", slug: "dynamic-programming" },
  { name: "Greedy", problems: 15, description: "Make locally optimal choices for global optimum", slug: "greedy" },
  { name: "Divide & Conquer", problems: 12, description: "Break problems into smaller subproblems", slug: "divide-conquer" },
  { name: "Monotonic Stack", problems: 10, description: "Next greater/smaller element patterns", slug: "monotonic-stack" },
];

export default function DSAPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "DSA", href: "/dsa" },
            ]),
            courseJsonLd({
              title: "DSA Mastery Course",
              description: "Complete Data Structures & Algorithms learning path",
              slug: "dsa",
            }),
          ]),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          DSA{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Mastery
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A structured learning path from basics to advanced. Master every topic needed for
          FAANG-level coding interviews.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-4 gap-4 rounded-2xl border bg-card p-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-violet-600">500+</div>
          <div className="text-sm text-muted-foreground">Problems</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">15</div>
          <div className="text-sm text-muted-foreground">Topics</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">8</div>
          <div className="text-sm text-muted-foreground">Patterns</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">12 wks</div>
          <div className="text-sm text-muted-foreground">Duration</div>
        </div>
      </div>

      {/* Learning Phases */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Learning Roadmap</h2>
        <div className="mt-8 space-y-8">
          {phases.map((phase) => (
            <div key={phase.phase}>
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r ${phase.color} text-white font-bold`}>
                  {phase.phase}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground">{phase.duration}</p>
                </div>
              </div>
              <div className="mt-4 ml-14 grid gap-3 sm:grid-cols-2">
                {phase.topics.map((topic) => (
                  <Link key={topic.slug} href={`/dsa/patterns/${topic.slug}`}>
                    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-sm font-medium">{topic.name}</CardTitle>
                        <Badge variant="secondary">{topic.problems} problems</Badge>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithm Patterns */}
      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Algorithm Patterns</h2>
          <Link href="/dsa/patterns">
            <Button variant="outline" className="rounded-full">View All Patterns</Button>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {patterns.map((pattern) => (
            <Link key={pattern.slug} href={`/dsa/patterns/${pattern.slug}`}>
              <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
                <CardHeader>
                  <CardTitle className="text-base">{pattern.name}</CardTitle>
                  <CardDescription className="text-xs">{pattern.description}</CardDescription>
                  <Badge variant="secondary" className="mt-2 w-fit">{pattern.problems} problems</Badge>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
