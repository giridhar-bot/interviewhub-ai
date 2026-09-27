import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { questionRepository } from "@/repositories/question.repository";

export const metadata = generateSEO({
  title: "HR Interview Questions & Preparation",
  description: "Browse published HR interview questions and preparation guidance.",
  path: "/interview/hr",
  keywords: ["HR interview", "HR questions", "salary negotiation", "interview preparation"],
});

export const dynamic = "force-dynamic";

const salaryTips = [
  "Research compensation ranges for the role and location before negotiating.",
  "Discuss expected compensation in terms of the full package, not just base salary.",
  "Use a researched range and explain how your experience supports it.",
  "Take time to review an offer before accepting or negotiating.",
];

export default async function HRInterviewPage() {
  const { questions, total } = await questionRepository.findPublishedByType("HR", 50);
  const topicCounts = new Map<string, { slug: string; count: number }>();
  for (const question of questions) {
    const existing = topicCounts.get(question.topic.name) ?? { slug: question.topic.slug, count: 0 };
    existing.count += 1;
    topicCounts.set(question.topic.name, existing);
  }

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
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">HR Interview</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published questions and preparation guidance for HR rounds.
        </p>
      </div>

      {topicCounts.size > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Question Topics</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from(topicCounts, ([name, topic]) => (
              <Link key={name} href={`/topics/${topic.slug}`}>
                <Badge variant="secondary">{name} · {topic.count}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Published HR Questions ({total})</h2>
        {questions.length ? (
          <div className="mt-6 space-y-3">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
                  <div>
                    <CardTitle className="text-sm font-medium">{question.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{question.content}</CardDescription>
                  </div>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No HR questions have been published yet.
          </p>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Salary Negotiation Guidance</h2>
        <div className="mt-6 rounded-xl border bg-card p-6">
          <ul className="space-y-3">
            {salaryTips.map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="mt-1 text-green-600" aria-hidden="true">✓</span>
                <span className="text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-8 text-center dark:from-violet-950/20 dark:to-indigo-950/20">
        <h2 className="text-2xl font-bold">Practice with AI HR Interviewer</h2>
        <p className="mt-2 text-muted-foreground">Practice your answers and get feedback.</p>
        <Link href="/ai-tools/mock-interview"><Button size="lg" className="mt-4">Start HR Mock Interview</Button></Link>
      </section>
    </div>
  );
}