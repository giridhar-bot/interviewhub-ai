import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { questionRepository } from "@/repositories/question.repository";

export const metadata = generateSEO({
  title: "Behavioral Interview Prep — STAR Method & Questions",
  description: "Review published behavioral interview questions and answer frameworks.",
  path: "/interview/behavioral",
  keywords: ["behavioral interview", "STAR method", "interview questions"],
});

export const dynamic = "force-dynamic";

const frameworks = [
  {
    name: "STAR Method",
    steps: ["Situation", "Task", "Action", "Result"],
    description: "Structure your answer with context, task, action, and outcome.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    name: "CAR Method",
    steps: ["Challenge", "Action", "Result"],
    description: "Focus on the challenge you faced and how you addressed it.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "SOAR Method",
    steps: ["Situation", "Obstacle", "Action", "Result"],
    description: "Describe the obstacle and the actions and outcome that followed.",
    color: "from-green-500 to-emerald-500",
  },
];

export default async function BehavioralInterviewPage() {
  const { questions, total } = await questionRepository.findPublishedByType("BEHAVIORAL", 50);
  const topicCounts = new Map<string, number>();
  for (const question of questions) {
    topicCounts.set(question.topic.name, (topicCounts.get(question.topic.name) ?? 0) + 1);
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
              { name: "Behavioral", href: "/interview/behavioral" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Behavioral Interview</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Review published questions and use structured frameworks to prepare your answers.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Answer Frameworks</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {frameworks.map((framework) => (
            <Card key={framework.name} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{framework.name}</CardTitle>
                <CardDescription className="mt-2">{framework.description}</CardDescription>
                <div className="mt-4 space-y-2">
                  {framework.steps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r ${framework.color} text-xs font-bold text-white`}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {topicCounts.size > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Question Topics</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from(topicCounts, ([name, count]) => (
              <Link key={name} href={`/topics/${questions.find((question) => question.topic.name === name)?.topic.slug}`}>
                <Badge variant="secondary">{name} · {count}</Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Published Behavioral Questions ({total})</h2>
        {questions.length ? (
          <div className="mt-6 space-y-3">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
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
            No behavioral questions have been published yet.
          </p>
        )}
      </section>

      <section className="mt-16 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 p-8 text-center dark:from-violet-950/20 dark:to-indigo-950/20">
        <h2 className="text-2xl font-bold">Practice with AI Mock Interview</h2>
        <p className="mt-2 text-muted-foreground">Get feedback on your behavioral answers.</p>
        <Link href="/ai-tools/mock-interview">
          <Button size="lg" className="mt-4">Start Mock Interview</Button>
        </Link>
      </section>
    </div>
  );
}