import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Study Groups — Learn Together, Grow Together",
  description:
    "Join study groups for DSA, system design, and interview preparation. Collaborate with peers, schedule sessions, and track progress together.",
  path: "/community/groups",
  keywords: ["study groups", "peer learning", "interview prep group", "DSA study group"],
});

const groups = [
  { name: "FAANG Interview Prep 2026", members: 234, topics: ["DSA", "System Design", "Behavioral"], activity: "Active now", slug: "faang-prep-2026" },
  { name: "Dynamic Programming Mastery", members: 156, topics: ["DP", "Recursion", "Memoization"], activity: "2h ago", slug: "dp-mastery" },
  { name: "System Design Study Circle", members: 189, topics: ["HLD", "LLD", "Architecture"], activity: "30m ago", slug: "system-design-circle" },
  { name: "Frontend Interview Prep", members: 312, topics: ["React", "JavaScript", "CSS"], activity: "1h ago", slug: "frontend-prep" },
  { name: "Java/Spring Boot Community", members: 145, topics: ["Java", "Spring Boot", "Microservices"], activity: "3h ago", slug: "java-spring" },
  { name: "ML/AI Interview Preparation", members: 98, topics: ["Machine Learning", "Python", "Statistics"], activity: "5h ago", slug: "ml-ai-prep" },
  { name: "Weekly Mock Interview Partners", members: 267, topics: ["Mock Interview", "Practice", "Feedback"], activity: "Active now", slug: "mock-interview-partners" },
  { name: "Backend Engineering Deep Dive", members: 178, topics: ["Databases", "APIs", "DevOps"], activity: "1h ago", slug: "backend-deep-dive" },
];

export default function StudyGroupsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Study Groups", href: "/community/groups" },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Study{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Groups
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Join a study group to learn with peers, share resources, and stay accountable.
          </p>
        </div>
        <Button>Create Group</Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.slug} className="cursor-pointer transition-all hover:shadow-lg hover:border-violet-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{g.name}</CardTitle>
                <Badge variant="secondary" className="text-xs shrink-0">{g.members} members</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {g.topics.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{g.activity}</span>
                <Button size="sm" variant="outline">Join</Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
