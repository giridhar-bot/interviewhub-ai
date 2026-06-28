import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { AcademicCapIcon, ClockIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Quizzes — Test Your Knowledge",
  description:
    "Timed MCQ quizzes for Java, React, AWS, SQL, System Design, and more. Earn XP, track scores, and climb the leaderboard.",
  path: "/learn/quizzes",
  keywords: ["tech quizzes", "interview quiz", "MCQ practice", "coding quiz"],
});

async function getPublishedQuizzes() {
  return prisma.quiz.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: {
      topic: { select: { name: true, slug: true } },
      _count: { select: { questions: true, attempts: true } },
    },
  });
}

export default async function QuizzesPage() {
  const quizzes = await getPublishedQuizzes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Quizzes", href: "/learn/quizzes" },
          ])),
        }}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
        <p className="mt-2 text-muted-foreground">
          Test your knowledge with timed MCQ quizzes. Earn XP and track your
          improvement.
        </p>
      </div>

      {quizzes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={`/learn/quizzes/${quiz.slug}`}>
              <Card className="group h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{quiz.topic.name}</Badge>
                    <Badge
                      variant={
                        quiz.difficulty === "EASY"
                          ? "default"
                          : quiz.difficulty === "HARD"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {quiz.description || `${quiz._count.questions} questions`}
                  </CardDescription>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{quiz._count.questions} questions</span>
                    {quiz.timeLimit && (
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {quiz.timeLimit} min
                      </span>
                    )}
                    <span>{quiz._count.attempts} attempts</span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No quizzes available yet</h2>
          <p className="mt-1 text-muted-foreground">Check back soon for new quizzes.</p>
        </div>
      )}
    </div>
  );
}
