import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { generateCompanySEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return generateCompanySEO({
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug,
    description: `Prepare for interviews at ${slug.replace(/-/g, " ")} with real interview questions, experiences, salary insights, and preparation plans.`,
  });
}

const tabs = [
  { label: "Overview", id: "overview" },
  { label: "Questions", id: "questions" },
  { label: "Experiences", id: "experiences" },
  { label: "Salary", id: "salary" },
];

const sampleQuestions = [
  { title: "Design a URL Shortener", type: "System Design", difficulty: "Medium" },
  { title: "Two Sum", type: "Coding", difficulty: "Easy" },
  { title: "Tell me about a time you led a project", type: "Behavioral", difficulty: "Medium" },
  { title: "Why do you want to work here?", type: "HR", difficulty: "Easy" },
  { title: "LRU Cache", type: "Coding", difficulty: "Medium" },
  { title: "Design Twitter Feed", type: "System Design", difficulty: "Hard" },
];

const sampleExperiences = [
  { role: "SDE-1", result: "Selected", rounds: 4, yoe: 2, date: "Jan 2025" },
  { role: "SDE-2", result: "Rejected", rounds: 5, yoe: 4, date: "Dec 2024" },
  { role: "SDE-1", result: "Selected", rounds: 4, yoe: 1, date: "Nov 2024" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

const typeColors: Record<string, string> = {
  Coding: "bg-blue-50 text-blue-600",
  "System Design": "bg-purple-50 text-purple-600",
  Behavioral: "bg-orange-50 text-orange-600",
  HR: "bg-green-50 text-green-600",
};

const resultColors: Record<string, string> = {
  Selected: "text-green-600",
  Rejected: "text-red-600",
};

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Companies", href: "/companies" },
              { name, href: `/companies/${slug}` },
            ])
          ),
        }}
      />

      {/* Company Header */}
      <div className="flex items-start gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-3xl font-bold text-violet-600">
          {name[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight">{name}</h1>
          <p className="mt-1 text-muted-foreground">Technology • San Francisco, CA</p>
          <div className="mt-3 flex gap-2">
            <Badge variant="secondary">120 Questions</Badge>
            <Badge variant="secondary">45 Experiences</Badge>
            <Badge variant="secondary">80 Salaries</Badge>
          </div>
        </div>
        <Button>Create Prep Plan</Button>
      </div>

      <Separator className="my-8" />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-violet-600">4-5</CardTitle>
            <CardDescription>Interview Rounds</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">35%</CardTitle>
            <CardDescription>Selection Rate</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-600">₹25L</CardTitle>
            <CardDescription>Avg Base (SDE-1)</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-orange-600">2-4 weeks</CardTitle>
            <CardDescription>Process Duration</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Interview Questions */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Interview Questions</h2>
          <Link href={`/companies/${slug}/questions`}>
            <Button variant="outline" className="rounded-full">View All</Button>
          </Link>
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Question</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {sampleQuestions.map((q, i) => (
                <tr key={i} className="cursor-pointer border-b transition-colors hover:bg-muted/30 last:border-0">
                  <td className="px-6 py-4 font-medium">{q.title}</td>
                  <td className="px-6 py-4">
                    <Badge className={typeColors[q.type]}>{q.type}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interview Experiences */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Interview Experiences</h2>
          <Link href={`/companies/${slug}/experiences`}>
            <Button variant="outline" className="rounded-full">View All</Button>
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {sampleExperiences.map((exp, i) => (
            <Card key={i} className="cursor-pointer transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{exp.role} Interview</CardTitle>
                  <CardDescription>{exp.rounds} rounds • {exp.yoe} YoE • {exp.date}</CardDescription>
                </div>
                <span className={`text-sm font-semibold ${resultColors[exp.result]}`}>
                  {exp.result}
                </span>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Salary Insights */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Salary Insights</h2>
          <Link href={`/companies/${slug}/salary`}>
            <Button variant="outline" className="rounded-full">View All</Button>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { role: "SDE-1", base: "₹18-28L", total: "₹22-35L", reports: 25 },
            { role: "SDE-2", base: "₹30-45L", total: "₹38-55L", reports: 18 },
            { role: "SDE-3", base: "₹50-70L", total: "₹65-90L", reports: 8 },
          ].map((s) => (
            <Card key={s.role}>
              <CardHeader>
                <CardTitle className="text-base">{s.role}</CardTitle>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base</span>
                    <span className="font-medium">{s.base}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Comp</span>
                    <span className="font-medium">{s.total}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.reports} reports</div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
