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
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return generateSEO({
    title: `${title} — Community Discussion`,
    description: `Read and participate in the discussion: ${title}. Share your thoughts and learn from the community.`,
    path: `/community/discussions/${slug}`,
  });
}

const sampleComments = [
  { author: "Rahul S.", content: "This is incredibly helpful! I followed a similar approach and got offers from 2 companies.", time: "1h ago", likes: 12 },
  { author: "Priya M.", content: "Can you elaborate on the system design preparation part? Which resources did you use?", time: "3h ago", likes: 8 },
  { author: "Amit K.", content: "Great write-up. I would also recommend practicing on a whiteboard — it helps with real interviews.", time: "5h ago", likes: 15 },
  { author: "Neha G.", content: "How many hours per day did you dedicate to preparation?", time: "8h ago", likes: 5 },
];

export default async function DiscussionDetailPage({ params }: Props) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Discussions", href: "/community/discussions" },
              { name: title, href: `/community/discussions/${slug}` },
            ])
          ),
        }}
      />

      {/* Post */}
      <div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Discussion</Badge>
          <Badge variant="outline">Google</Badge>
          <Badge variant="outline">DSA</Badge>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{title}</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span>by Ankit S.</span>
          <span>2h ago</span>
          <span>42 replies</span>
          <span>156 likes</span>
        </div>

        <Separator className="my-6" />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            This is my detailed experience and preparation strategy. I focused heavily on
            data structures and algorithms for the first 2 months, then shifted to system
            design in the final month.
          </p>
          <h2>My Preparation Timeline</h2>
          <ul>
            <li>Month 1: Arrays, Strings, Linked Lists, Trees (150 problems)</li>
            <li>Month 2: Graphs, DP, Greedy, Backtracking (120 problems)</li>
            <li>Month 3: System Design + Mock Interviews (15 designs + 10 mocks)</li>
          </ul>
          <h2>Key Takeaways</h2>
          <p>
            Focus on understanding patterns rather than memorizing solutions. Practice
            explaining your thought process out loud — communication is as important
            as the solution itself.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="sm">👍 156</Button>
          <Button variant="outline" size="sm">👎 3</Button>
          <Button variant="outline" size="sm">Bookmark</Button>
          <Button variant="outline" size="sm">Share</Button>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Comments */}
      <div>
        <h2 className="text-xl font-bold">{sampleComments.length} Replies</h2>

        {/* Reply Box */}
        <Card className="mt-4">
          <CardHeader>
            <div className="h-20 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              Write your reply...
            </div>
            <div className="mt-2 flex justify-end">
              <Button size="sm">Post Reply</Button>
            </div>
          </CardHeader>
        </Card>

        {/* Comment List */}
        <div className="mt-6 space-y-4">
          {sampleComments.map((c, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-sm font-bold text-violet-600">
                    {c.author[0]}
                  </div>
                  <span className="text-sm font-medium">{c.author}</span>
                  <span className="text-xs text-muted-foreground">{c.time}</span>
                </div>
                <span className="text-xs text-muted-foreground">👍 {c.likes}</span>
              </div>
              <p className="mt-2 text-sm">{c.content}</p>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs">Reply</Button>
                <Button variant="ghost" size="sm" className="text-xs">Like</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
