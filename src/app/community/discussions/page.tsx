import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Community Discussions — Ask, Share & Learn Together",
  description:
    "Join discussions on DSA, system design, interview tips, and career guidance. Ask questions, share knowledge, and learn from experienced engineers.",
  path: "/community/discussions",
  keywords: ["tech discussions", "developer community", "interview tips", "career advice"],
});

const discussions = [
  { title: "How I cracked Google L4 in 3 months", author: "Ankit S.", tags: ["Google", "System Design", "DSA"], replies: 42, likes: 156, time: "2h ago", slug: "cracked-google-l4" },
  { title: "Spring Boot Microservices — best resources?", author: "Priya M.", tags: ["Spring Boot", "Microservices"], replies: 18, likes: 67, time: "5h ago", slug: "spring-boot-resources" },
  { title: "SAP FICO interview experience at Deloitte", author: "Raj K.", tags: ["SAP", "FICO", "Deloitte"], replies: 12, likes: 89, time: "1d ago", slug: "sap-fico-deloitte" },
  { title: "React vs Angular for 2026 — which one to learn?", author: "Neha G.", tags: ["React", "Angular", "Frontend"], replies: 56, likes: 203, time: "1d ago", slug: "react-vs-angular-2026" },
  { title: "AWS Solutions Architect prep strategy", author: "Vikram T.", tags: ["AWS", "Cloud", "Certification"], replies: 23, likes: 134, time: "2d ago", slug: "aws-sa-prep" },
  { title: "System Design interview at Uber — my experience", author: "Sara P.", tags: ["Uber", "System Design"], replies: 31, likes: 178, time: "2d ago", slug: "uber-system-design" },
  { title: "Best approach for DP problems?", author: "Rohan D.", tags: ["DP", "DSA", "Tips"], replies: 45, likes: 220, time: "3d ago", slug: "dp-approach" },
  { title: "Salary negotiation tips for freshers", author: "Meera J.", tags: ["Salary", "HR", "Tips"], replies: 67, likes: 310, time: "3d ago", slug: "salary-negotiation-freshers" },
];

const trendingTags = ["DSA", "System Design", "Google", "Amazon", "React", "Java", "Python", "AWS", "Interview Tips", "Resume"];

export default function DiscussionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Discussions", href: "/community/discussions" },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Community{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Discussions
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Ask questions, share knowledge, and learn from the community.
          </p>
        </div>
        <Link href="/community/ask">
          <Button>Start Discussion</Button>
        </Link>
      </div>

      {/* Trending Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {trendingTags.map((tag) => (
          <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-violet-50">
            #{tag}
          </Badge>
        ))}
      </div>

      {/* Sort Controls */}
      <div className="mt-6 flex gap-2">
        {["Latest", "Popular", "Unanswered"].map((sort) => (
          <Badge
            key={sort}
            variant={sort === "Latest" ? "default" : "outline"}
            className="cursor-pointer"
          >
            {sort}
          </Badge>
        ))}
      </div>

      {/* Discussion List */}
      <div className="mt-6 space-y-3">
        {discussions.map((d) => (
          <Link key={d.slug} href={`/community/discussions/${d.slug}`}>
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex-1">
                  <CardTitle className="text-base">{d.title}</CardTitle>
                  <CardDescription className="mt-1">
                    by {d.author} • {d.time}
                  </CardDescription>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {d.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{d.replies} replies</span>
                  <span>{d.likes} likes</span>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
