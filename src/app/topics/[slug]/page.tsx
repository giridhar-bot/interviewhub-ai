import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/json-ld";
import { topicRepository } from "@/repositories/topic.repository";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function TopicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const topic = await topicRepository.findPublicPageBySlug(slug);

  if (!topic) notFound();

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
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/topics" className="hover:text-foreground">Topics</Link>
        <span>/</span>
        <span className="text-foreground">{topic.name}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {topic.name}
            </h1>
            <Badge variant="secondary">{topic.category}</Badge>
          </div>
          {topic.description && (
            <p className="mt-2 text-lg text-muted-foreground">{topic.description}</p>
          )}
        </div>
        <Button className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          Start Learning
        </Button>
      </div>

      <Tabs defaultValue="questions" className="mt-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions">Interview Questions ({topic._count.questions})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({topic._count.articles})</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap ({topic._count.roadmaps})</TabsTrigger>
          <TabsTrigger value="cheatsheet">Cheat Sheet ({topic._count.cheatSheets})</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-8">
          {topic.questions.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.questions.map((question) => (
                <Card key={question.id}>
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {question.difficulty}
                    </Badge>
                    <CardTitle className="mt-2 text-base">{question.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-sm">
                      {contentPreview(question.content)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No published interview questions for this topic yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="notes" className="mt-8">
          {topic.articles.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3 text-sm">
                      {article.excerpt ?? article.shortDescription ?? `${article.readTime} min read`}
                    </CardDescription>
                  </CardHeader>
                </Card>
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
    </div>
  );
}