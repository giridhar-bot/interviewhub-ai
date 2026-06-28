import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { BookOpenIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Notes — Technical Interview Notes & Guides",
  description:
    "Comprehensive interview notes with code examples, diagrams, and explanations. Covering Java, Spring Boot, React, AWS, System Design, and 50+ topics.",
  path: "/learn/notes",
  keywords: ["interview notes", "tech notes", "programming guides", "code examples"],
});

async function getPublishedNotes() {
  const [notes, topics] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: 30,
      include: {
        topic: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
    }),
    prisma.topic.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, _count: { select: { articles: true } } },
    }),
  ]);
  return { notes, topics };
}

export default async function NotesPage() {
  const { notes, topics } = await getPublishedNotes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Notes", href: "/learn/notes" },
          ])),
        }}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <p className="mt-2 text-muted-foreground">
          In-depth technical guides with code examples, diagrams, and interview questions.
        </p>
      </div>

      {/* Topic Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Badge variant="default" className="cursor-pointer">All</Badge>
        {topics.map((t) => (
          <Link key={t.id} href={`/topics/${t.slug}`}>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              {t.name} ({t._count.articles})
            </Badge>
          </Link>
        ))}
      </div>

      {/* Notes Grid */}
      {notes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/learn/notes/${note.slug}`}>
              <Card className="group h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{note.topic.name}</Badge>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3.5 w-3.5" />
                      {note.readTime} min
                    </span>
                  </div>
                  <CardTitle className="mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {note.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {note.excerpt || "Read more..."}
                  </CardDescription>
                  {note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs"
                        >
                          <TagIcon className="mr-1 h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No notes published yet</h2>
          <p className="mt-1 text-muted-foreground">Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
}
