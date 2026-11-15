import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/json-ld";
import { topicRepository } from "@/repositories/topic.repository";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { compileMdxContent } from "@/lib/mdx";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

function contentPreview(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 220 ? `${normalized.slice(0, 220)}...` : normalized;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const topic = await topicRepository.findPublishedBySlug(slug);

  if (!topic) return { title: "Topic Not Found" };

  const description = topic.description ?? `Explore published learning content for ${topic.name}.`;
  return {
    title: `${topic.name} Interview Questions, Notes & Roadmap`,
    description: `Prepare for ${topic.name} interviews with published questions, notes, roadmaps and cheat sheets. ${description}`,
    keywords: [
      `${topic.name} interview questions`,
      `${topic.name} notes`,
      `${topic.name} roadmap`,
      `${topic.name} cheat sheet`,
      `${topic.name} tutorial`,
    ],
    openGraph: {
      title: `${topic.name} Interview Questions, Notes & Roadmap`,
      description,
      url: `https://interviewhub.ai/topics/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://interviewhub.ai/topics/${slug}`,
    },
  };
}

export default async function TopicPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ questionPage?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const parsedPage = z.coerce
    .number()
    .int()
    .min(1)
    .max(10000)
    .safeParse(query.questionPage ?? "1");
  if (!parsedPage.success) notFound();
  const questionPage = parsedPage.data;
  const topic = await topicRepository.findPublicPageBySlug(slug, questionPage);

  if (!topic) notFound();
  const questionPages = Math.max(1, Math.ceil(topic._count.questions / 50));
  if (questionPage > questionPages) notFound();
  const startHref = topic.roadmaps[0]
    ? `/learn/roadmaps/${topic.roadmaps[0].slug}`
    : topic.articles[0]
      ? `/learn/notes/${topic.articles[0].slug}`
      : null;
  const answers = new Map(
    await Promise.all(
      topic.questions.map(
        async (question) =>
          [
            question.id,
            question.answer
              ? (await compileMdxContent(question.answer, `question-${question.id}-`)).content
              : null,
          ] as const
      )
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Topics", href: "/topics" },
              { name: topic.name, href: `/topics/${slug}` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              title: `${topic.name} Interview Preparation`,
              description: topic.description ?? `Published learning content for ${topic.name}.`,
              slug,
            })
          ),
        }}
      />

      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/topics" className="hover:text-foreground">
          Topics
        </Link>
        <span>/</span>
        <span className="text-foreground">{topic.name}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{topic.name}</h1>
            <Badge variant="secondary">{topic.category}</Badge>
          </div>
          {topic.description && (
            <p className="mt-2 text-lg text-muted-foreground">{topic.description}</p>
          )}
        </div>
        {startHref && (
          <Link href={startHref}>
            <Button className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
              Start Learning
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="questions" className="mt-12">
        <TabsList className="grid w-full auto-rows-fr grid-cols-2 items-stretch gap-1 group-data-horizontal/tabs:h-auto sm:grid-cols-4">
          <TabsTrigger
            value="questions"
            className="h-full min-h-11 min-w-0 w-full whitespace-normal"
          >
            Interview Questions ({topic._count.questions})
          </TabsTrigger>
          <TabsTrigger value="notes" className="h-full min-h-11 min-w-0 w-full whitespace-normal">
            Notes ({topic._count.articles})
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="h-full min-h-11 min-w-0 w-full whitespace-normal">
            Roadmap ({topic._count.roadmaps})
          </TabsTrigger>
          <TabsTrigger
            value="cheatsheet"
            className="h-full min-h-11 min-w-0 w-full whitespace-normal"
          >
            Cheat Sheet ({topic._count.cheatSheets})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-8">
          {topic.questions.length ? (
            <div className="grid items-start gap-4 sm:grid-cols-2">
              {topic.questions.map((question) => (
                <Card key={question.id} className="min-w-0">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {question.difficulty}
                    </Badge>
                    <CardTitle className="mt-2 text-base">{question.title}</CardTitle>
                    <CardDescription className="whitespace-pre-wrap text-sm">
                      {question.content}
                    </CardDescription>
                  </CardHeader>
                  {answers.get(question.id) && (
                    <details className="px-4 pb-4">
                      <summary className="cursor-pointer rounded-md text-sm font-medium text-primary">
                        Read answer
                      </summary>
                      <div className="mt-4 space-y-3 break-words text-sm leading-7 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
                        {answers.get(question.id)}
                      </div>
                    </details>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No published interview questions for this topic yet.
            </p>
          )}
          {questionPages > 1 && (
            <nav
              aria-label="Interview question pages"
              className="mt-6 flex items-center justify-between gap-4 text-sm"
            >
              {questionPage > 1 ? (
                <Link
                  href={`/topics/${slug}?questionPage=${questionPage - 1}`}
                  className="text-primary hover:underline"
                >
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span>
                Page {questionPage} of {questionPages}
              </span>
              {questionPage < questionPages ? (
                <Link
                  href={`/topics/${slug}?questionPage=${questionPage + 1}`}
                  className="text-primary hover:underline"
                >
                  Next
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-8">
          {topic.articles.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.articles.map((article) => (
                <Link key={article.id} href={`/learn/notes/${article.slug}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-sm">
                        {article.excerpt ??
                          article.shortDescription ??
                          `${article.readTime} min read`}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No published notes for this topic yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="roadmap" className="mt-8">
          {topic.roadmaps.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.roadmaps.map((roadmap) => (
                <Link key={roadmap.id} href={`/learn/roadmaps/${roadmap.slug}`}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">{roadmap.title}</CardTitle>
                      {roadmap.description && (
                        <CardDescription className="line-clamp-3 text-sm">
                          {roadmap.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No published roadmap for this topic yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="cheatsheet" className="mt-8">
          {topic.cheatSheets.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.cheatSheets.map((cheatSheet) => (
                <Link key={cheatSheet.id} href={`/learn/cheat-sheets/${cheatSheet.slug}`}>
                  <Card className="h-full transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base">{cheatSheet.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-sm">
                        {contentPreview(cheatSheet.content)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No published cheat sheet for this topic yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
      {(topic.flashcardDecks.length > 0 || topic.quizzes.length > 0) && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Practice and revision</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {topic.flashcardDecks.map((deck) => (
              <Link key={deck.id} href={`/learn/flashcards/${deck.slug}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{deck.title}</CardTitle>
                    <CardDescription>{deck._count.flashcards} flashcards</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
            {topic.quizzes.map((quiz) => (
              <Link key={quiz.id} href={`/learn/quizzes/${quiz.slug}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>{quiz._count.questions} quiz questions</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
