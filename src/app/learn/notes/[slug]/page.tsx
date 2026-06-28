import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { compileMdxContent, extractTableOfContents } from "@/lib/mdx";
import { generateArticleSEO } from "@/lib/seo";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/json-ld";
import {
  ClockIcon,
  EyeIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      subTopic: { select: { name: true, slug: true } },
      author: { select: { name: true, image: true } },
    },
  });

  if (article) {
    await prisma.article.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    });
  }

  return article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Not Found" };

  return generateArticleSEO({
    title: article.title,
    description: article.excerpt || `Read about ${article.title}`,
    path: `/learn/notes/${article.slug}`,
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    authorName: article.author?.name || "InterviewHub AI",
    tags: article.tags,
  });
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const toc = extractTableOfContents(article.content);

  let mdxContent: React.ReactNode;
  try {
    const { content } = await compileMdxContent(article.content);
    mdxContent = content;
  } catch {
    mdxContent = (
      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
        {article.content}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Notes", href: "/learn/notes" },
            { name: article.title, href: `/learn/notes/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd({
            title: article.title,
            description: article.excerpt || article.title,
            slug: article.slug,
            publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString(),
            authorName: article.author?.name || "InterviewHub AI",
          })),
        }}
      />

      {/* Back link */}
      <Link
        href="/learn/notes"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Notes
      </Link>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
        {/* Main Content */}
        <article>
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link href={`/topics/${article.topic.slug}`}>
                <Badge variant="secondary">{article.topic.name}</Badge>
              </Link>
              {article.subTopic && (
                <>
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                  <Badge variant="outline">{article.subTopic.name}</Badge>
                </>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {article.author?.name && (
                <span>By {article.author.name}</span>
              )}
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                {article.views.toLocaleString()} views
              </span>
            </div>
            {article.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="mb-8" />

          {/* MDX Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:text-foreground">
            {mdxContent}
          </div>
        </article>

        {/* Sidebar — Table of Contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h3 className="mb-4 text-sm font-semibold">On this page</h3>
            {toc.length > 0 ? (
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            ) : (
              <p className="text-sm text-muted-foreground">No headings found</p>
            )}

            <Separator className="my-6" />

            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <BookmarkIcon className="h-4 w-4" />
                Bookmark
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
