import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { generateCodingProblemSEO } from "@/lib/seo";
import { codingProblemJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateCodingProblemSEO({
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug,
    difficulty: "Medium",
    tags: ["DSA"],
  });
}

const sampleTestCases = [
  { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9" },
  { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "" },
  { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "" },
];

const relatedProblems = [
  { title: "Three Sum", slug: "three-sum", difficulty: "Medium" },
  { title: "Four Sum", slug: "four-sum", difficulty: "Medium" },
  { title: "Two Sum II", slug: "two-sum-ii", difficulty: "Medium" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default async function CodingProblemPage({ params }: Props) {
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
              { name: "Problems", href: "/coding/problems" },
              { name: title, href: `/coding/problems/${slug}` },
            ])
          ),
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Problem Description */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <Badge className={difficultyColors["Medium"]}>Medium</Badge>
          </div>

          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Acceptance: 45%</span>
            <span>Submissions: 12.5K</span>
            <span>Likes: 890</span>
          </div>

          <Separator className="my-6" />

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Given an array of integers <code>nums</code> and an integer <code>target</code>,
              return <em>indices of the two numbers</em> such that they add up to{" "}
              <code>target</code>.
            </p>
            <p>
              You may assume that each input would have <strong>exactly one solution</strong>,
              and you may not use the same element twice.
            </p>
            <p>You can return the answer in any order.</p>
          </div>

          {/* Test Cases */}
          <div className="mt-8">
            <h2 className="text-xl font-bold">Examples</h2>
            <div className="mt-4 space-y-4">
              {sampleTestCases.map((tc, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-sm">Example {i + 1}</CardTitle>
                    <div className="mt-2 space-y-1 rounded-lg bg-muted/50 p-3 font-mono text-sm">
                      <div><span className="text-muted-foreground">Input: </span>{tc.input}</div>
                      <div><span className="text-muted-foreground">Output: </span>{tc.output}</div>
                      {tc.explanation && (
                        <div><span className="text-muted-foreground">Explanation: </span>{tc.explanation}</div>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="mt-8">
            <h2 className="text-xl font-bold">Constraints</h2>
            <ul className="mt-4 list-disc space-y-1 pl-6 font-mono text-sm">
              <li>2 ≤ nums.length ≤ 10⁴</li>
              <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
              <li>-10⁹ ≤ target ≤ 10⁹</li>
              <li>Only one valid answer exists.</li>
            </ul>
          </div>

          {/* Code Editor Placeholder */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
                <CardDescription>
                  Select your language and write your solution below.
                </CardDescription>
              </CardHeader>
              <div className="border-t p-6">
                <div className="flex h-80 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">Monaco Editor</p>
                    <p className="text-sm">Code editor will load here</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline">Run Code</Button>
                  <Button>Submit Solution</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Problem Info</CardTitle>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <Badge className={difficultyColors["Medium"]}>Medium</Badge>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Topic</span>
                <span>Arrays, Hash Table</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Companies</span>
                <span>Google, Amazon, Meta</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Related Problems</CardTitle>
            </CardHeader>
            <div className="space-y-2 px-6 pb-6">
              {relatedProblems.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/coding/problems/${rp.slug}`}
                  className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50"
                >
                  <span className="text-sm">{rp.title}</span>
                  <span className={`text-xs ${difficultyColors[rp.difficulty]?.split(" ")[0]}`}>
                    {rp.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your Submissions</CardTitle>
              <CardDescription>Login to see your submission history</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
