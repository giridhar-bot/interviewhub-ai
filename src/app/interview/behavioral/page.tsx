import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Behavioral Interview Prep — STAR Method & Practice Questions",
  description:
    "Master behavioral interviews with the STAR framework. Practice with 200+ questions, build your story bank, and ace behavioral rounds at top companies.",
  path: "/interview/behavioral",
  keywords: ["behavioral interview", "STAR method", "interview questions", "leadership principles"],
});

const categories = [
  { name: "Leadership", count: 25, icon: "👑", slug: "leadership" },
  { name: "Conflict Resolution", count: 20, icon: "🤝", slug: "conflict-resolution" },
  { name: "Failure & Learning", count: 18, icon: "📈", slug: "failure-learning" },
  { name: "Teamwork", count: 22, icon: "🏆", slug: "teamwork" },
  { name: "Time Management", count: 15, icon: "⏰", slug: "time-management" },
  { name: "Pressure Handling", count: 12, icon: "💪", slug: "pressure-handling" },
  { name: "Innovation", count: 16, icon: "💡", slug: "innovation" },
  { name: "Customer Focus", count: 14, icon: "🎯", slug: "customer-focus" },
];

const frameworks = [
  {
    name: "STAR Method",
    steps: ["Situation", "Task", "Action", "Result"],
    description: "The most widely used framework. Structure your answer with context, task, action, and quantified result.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    name: "CAR Method",
    steps: ["Challenge", "Action", "Result"],
    description: "A shorter alternative that focuses on the challenge you faced and how you overcame it.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "SOAR Method",
    steps: ["Situation", "Obstacle", "Action", "Result"],
    description: "Emphasizes the obstacles you overcame, showing resilience and problem-solving.",
    color: "from-green-500 to-emerald-500",
  },
];

const topQuestions = [
  "Tell me about a time you led a project that failed",
  "Describe a situation where you disagreed with your manager",
  "Give an example of when you had to meet a tight deadline",
  "Tell me about a time you went above and beyond",
  "Describe a conflict with a team member and how you resolved it",
  "Tell me about your biggest professional achievement",
];

export default function BehavioralInterviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Interview", href: "/interview" },
              { name: "Behavioral", href: "/interview/behavioral" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Behavioral{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Interview
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Master behavioral interviews with proven frameworks. Build your story bank
          and practice with AI mock interviews.
        </p>
      </div>

      {/* Frameworks */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Answer Frameworks</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {frameworks.map((fw) => (
            <Card key={fw.name} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{fw.name}</CardTitle>
                <CardDescription className="mt-2">{fw.description}</CardDescription>
                <div className="mt-4 space-y-2">
                  {fw.steps.map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r ${fw.color} text-xs text-white font-bold`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Question Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Card key={cat.slug} className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <CardTitle className="text-sm">{cat.name}</CardTitle>
                  <CardDescription>{cat.count} questions</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Questions */}
      <div className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Most Asked Questions</h2>
          <Button variant="outline" className="rounded-full">View All</Button>
        </div>
        <div className="mt-6 space-y-3">
          {topQuestions.map((q, i) => (
            <Card key={i} className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                    {i + 1}
                  </div>
                  <CardTitle className="text-sm font-medium">{q}</CardTitle>
                </div>
                <Badge variant="secondary">Practice</Badge>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-8 text-center dark:from-violet-950/20 dark:to-indigo-950/20">
        <h2 className="text-2xl font-bold">Practice with AI Mock Interview</h2>
        <p className="mt-2 text-muted-foreground">
          Get real-time feedback on your behavioral answers with our AI interviewer.
        </p>
        <Link href="/interview">
          <Button size="lg" className="mt-4">Start Mock Interview</Button>
        </Link>
      </div>
    </div>
  );
}
