import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { BookOpenIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import { articleRepository } from "@/repositories/article.repository";
import { z } from "zod";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Notes — Technical Interview Notes & Guides",
  description:
    "Browse published technical interview notes with code examples, diagrams, and explanations.",
  path: "/learn/notes",
  keywords: ["interview notes", "tech notes", "programming guides", "code examples"],
});

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const parsedPage = z.coerce
    .number()
    .int()
    .min(1)
    .max(10000)
    .safeParse(query.page ?? "1");
  if (!parsedPage.success) notFound();
  const page = parsedPage.data;
  const { notes, topics, totalPages } = await articleRepository.findPublishedLibrary(page);
  if (page > totalPages) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Learn", href: "/learn" },
              { name: "Notes", href: "/learn/notes" },
            ])
          ),
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
        <Badge variant="default" className="cursor-pointer">
          All
        </Badge>
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
                  {totalPages > 1 && (
                    <nav
                      aria-label="Note pages"
                      className="mt-8 flex items-center justify-between gap-4 text-sm"
                    >
                      {page > 1 ? (
                        <Link
                          href={`/learn/notes?page=${page - 1}`}
                          className="text-primary hover:underline"
                        >
                          Previous
                        </Link>
                      ) : (
                        <span />
                      )}
                      <span>
                        Page {page} of {totalPages}
                      </span>
                      {page < totalPages ? (
                        <Link
                          href={`/learn/notes?page=${page + 1}`}
                          className="text-primary hover:underline"
                        >
                          Next
                        </Link>
                      ) : (
                        <span />
                      )}
                    </nav>
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
