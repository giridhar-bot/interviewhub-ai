import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import {
  BookOpenIcon,
  MapIcon,
  RectangleStackIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content CMS — Admin",
  robots: { index: false, follow: false },
};

async function getContentStats() {
  const [articles, roadmaps, decks, quizzes, cheatSheets, topics] = await Promise.all([
    prisma.article.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.roadmap.count({ where: { deletedAt: null } }),
    prisma.flashcardDeck.count(),
    prisma.quiz.count(),
    prisma.cheatSheet.count({ where: { deletedAt: null } }),
    prisma.topic.count({ where: { status: "PUBLISHED" } }),
  ]);

  const articleStats = {
    published: articles.find((a) => a.status === "PUBLISHED")?._count || 0,
    draft: articles.find((a) => a.status === "DRAFT")?._count || 0,
    archived: articles.find((a) => a.status === "ARCHIVED")?._count || 0,
  };

  return { articleStats, roadmaps, decks, quizzes, cheatSheets, topics };
}

async function getRecentArticles() {
  return prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      views: true,
      updatedAt: true,
      topic: { select: { name: true } },
      author: { select: { name: true } },
    },
  });
}

export default async function AdminCMSPage() {
  const [stats, recentArticles] = await Promise.all([
    getContentStats(),
    getRecentArticles(),
  ]);

  const contentModules = [
    {
      title: "Articles / Notes",
      icon: BookOpenIcon,
      published: stats.articleStats.published,
      draft: stats.articleStats.draft,
      total: stats.articleStats.published + stats.articleStats.draft + stats.articleStats.archived,
      color: "text-blue-600",
    },
    {
      title: "Roadmaps",
      icon: MapIcon,
      total: stats.roadmaps,
      color: "text-green-600",
    },
    {
      title: "Flashcard Decks",
      icon: RectangleStackIcon,
      total: stats.decks,
      color: "text-purple-600",
    },
    {
      title: "Quizzes",
      icon: AcademicCapIcon,
      total: stats.quizzes,
      color: "text-orange-600",
    },
    {
      title: "Cheat Sheets",
      icon: DocumentTextIcon,
      total: stats.cheatSheets,
      color: "text-red-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content CMS</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all learning content — {stats.topics} active topics.
          </p>
        </div>
        <Button className="gap-2">
          <PencilSquareIcon className="h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {contentModules.map((mod) => (
          <Card key={mod.title}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <mod.icon className={`h-5 w-5 ${mod.color}`} />
                <span className="text-2xl font-bold">{mod.total}</span>
              </div>
              <CardTitle className="text-sm">{mod.title}</CardTitle>
              {mod.published !== undefined && (
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="text-green-600">{mod.published} published</span>
                  <span>{mod.draft} draft</span>
                </div>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Content Workflow */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold">Content Workflow</h2>
        <div className="mt-4 flex items-center gap-3">
          {["Draft", "Tech Review", "SEO Review", "Published", "Archived"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <Badge variant={i === 3 ? "default" : "outline"} className="whitespace-nowrap">
                {step}
              </Badge>
              {i < 4 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Articles */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Articles</h2>
        <Card>
          <div className="divide-y">
            {recentArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{article.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{article.topic.name}</span>
                    {article.author?.name && <span>by {article.author.name}</span>}
                    <span>{article.views} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      article.status === "PUBLISHED"
                        ? "default"
                        : article.status === "DRAFT"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {article.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentArticles.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No articles yet. Create your first note!
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Create Roadmap", href: "#", icon: MapIcon },
          { label: "Create Flashcard Deck", href: "#", icon: RectangleStackIcon },
          { label: "Create Quiz", href: "#", icon: AcademicCapIcon },
          { label: "Content Analytics", href: "#", icon: ChartBarIcon },
        ].map((action) => (
          <Button key={action.label} variant="outline" className="h-auto flex-col gap-2 py-4">
            <action.icon className="h-5 w-5" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
