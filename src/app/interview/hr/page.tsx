import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "HR Interview Questions — Common Questions & Best Answers",
  description:
    "Prepare for HR interviews with 150+ commonly asked questions and expert answer strategies. Salary negotiation, career goals, and company-specific prep.",
  path: "/interview/hr",
  keywords: ["HR interview", "HR questions", "salary negotiation", "interview preparation"],
});

const hrCategories = [
  { name: "Tell Me About Yourself", count: 10, description: "Self-introduction strategies for different experience levels" },
  { name: "Why This Company?", count: 12, description: "Research-backed answers showing genuine interest" },
  { name: "Strengths & Weaknesses", count: 15, description: "Present strengths effectively and frame weaknesses positively" },
  { name: "Career Goals", count: 10, description: "Short-term and long-term career vision alignment" },
  { name: "Job Switch Reason", count: 8, description: "Explain career transitions diplomatically" },
  { name: "Salary Expectations", count: 12, description: "Negotiation tactics and market research strategies" },
  { name: "Work Culture Fit", count: 10, description: "Demonstrate cultural alignment with the company" },
  { name: "Conflict & Challenges", count: 15, description: "Show problem-solving in workplace scenarios" },
  { name: "Availability & Notice Period", count: 6, description: "Handle timing questions professionally" },
  { name: "Questions to Ask HR", count: 15, description: "Smart questions that show engagement and research" },
];

const salaryTips = [
  "Research market rates on Levels.fyi, Glassdoor, and AmbitionBox before negotiating",
  "Never share your current salary — focus on expected compensation based on market value",
  "Consider total compensation: base, bonus, stocks, benefits, and growth opportunities",
  "Use silence as a negotiation tool — don't rush to fill gaps",
  "Always negotiate — most companies expect it and have a range in mind",
];

const topQuestions = [
  { question: "Tell me about yourself", tip: "Use Present-Past-Future structure", difficulty: "Easy" },
  { question: "Why should we hire you?", tip: "Match your skills to their job description", difficulty: "Medium" },
  { question: "What are your salary expectations?", tip: "Give a researched range, not a single number", difficulty: "Hard" },
  { question: "Where do you see yourself in 5 years?", tip: "Align with company growth trajectory", difficulty: "Easy" },
  { question: "Why are you leaving your current job?", tip: "Focus on growth, never badmouth", difficulty: "Medium" },
  { question: "What's your biggest weakness?", tip: "Real weakness + steps you're taking to improve", difficulty: "Medium" },
  { question: "Do you have any questions for us?", tip: "Ask about team, growth, and company vision", difficulty: "Easy" },
  { question: "How do you handle pressure?", tip: "Give specific examples with positive outcomes", difficulty: "Medium" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default function HRInterviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Interview", href: "/interview" },
              { name: "HR", href: "/interview/hr" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          HR{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Interview
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Ace HR rounds with expert strategies. From self-introduction to salary negotiation —
          everything you need to know.
        </p>
      </div>

      {/* Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Question Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {hrCategories.map((cat) => (
            <Card key={cat.name} className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                  <Badge variant="secondary">{cat.count}</Badge>
                </div>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Questions */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Most Common HR Questions</h2>
        <div className="mt-6 space-y-3">
          {topQuestions.map((q, i) => (
            <Card key={i} className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">{q.question}</CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      Tip: {q.tip}
                    </CardDescription>
                  </div>
                </div>
                <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[q.difficulty]}`}>
                  {q.difficulty}
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Salary Negotiation Tips */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Salary Negotiation Tips</h2>
        <div className="mt-6 rounded-xl border bg-card p-6">
          <ul className="space-y-3">
            {salaryTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs text-green-600 font-bold">
                  ✓
                </div>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-8 text-center dark:from-violet-950/20 dark:to-indigo-950/20">
        <h2 className="text-2xl font-bold">Practice with AI HR Interviewer</h2>
        <p className="mt-2 text-muted-foreground">
          Simulate a real HR interview with our AI. Get instant feedback on your answers.
        </p>
        <Link href="/interview">
          <Button size="lg" className="mt-4">Start HR Mock Interview</Button>
        </Link>
      </div>
    </div>
  );
}
