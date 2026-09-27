import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articleRepository } from "@/repositories/article.repository";
import { compileMdxContent, extractTableOfContents } from "@/lib/mdx";
import { generateArticleSEO } from "@/lib/seo";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  const article = await articleRepository.findPublishedBySlug(slug);
  if (article) await articleRepository.incrementViews(article.id);
  return article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await articleRepository.findPublishedBySlug(slug);

  if (!article || article.topic.category !== "System Design") {
    return { title: "System Design Article Not Found" };
  }

  return generateArticleSEO({
    title: article.title,
    description: article.excerpt ?? article.shortDescription ?? `Published system-design article: ${article.title}`,
    path: `/system-design/${slug}`,
    publishedTime: article.publishedAt?.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    authorName: article.author?.displayName ?? "InterviewHub AI",
    tags: article.tags,
  });
}

export default async function SystemDesignDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article || article.topic.category !== "System Design") notFound();

  const relatedArticles = (await articleRepository.findPublishedByTopicCategory("System Design", 12))
    .filter((related) => related.id !== article.id)
    .slice(0, 4);
  const toc = extractTableOfContents(article.content);

  let content: React.ReactNode;
  try {
    content = (await compileMdxContent(article.content)).content;
  } catch {
    content = <div className="whitespace-pre-wrap">{article.content}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "System Design", href: "/system-design" },
              { name: article.title, href: `/system-design/${slug}` },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: article.title,
              description: article.excerpt ?? article.title,
              slug: article.slug,
              publishedAt: article.publishedAt?.toISOString() ?? article.createdAt.toISOString(),
              updatedAt: article.updatedAt.toISOString(),
              authorName: article.author?.displayName ?? "InterviewHub AI",
            })
          ),
        }}
      />

      <Link href="/system-design" className="mb-6 inline-flex text-sm text-muted-foreground hover:text-foreground">
        Back to System Design
      </Link>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
        <article>
          <div className="mb-8">
            <Link href={`/topics/${article.topic.slug}`}>
              <Badge variant="secondary">{article.topic.name}</Badge>
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{article.title}</h1>
            {article.excerpt && <p className="mt-3 text-lg text-muted-foreground">{article.excerpt}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
            </div>
          </div>

          <Separator className="mb-8" />
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-pre:bg-muted prose-pre:text-foreground">
            {content}
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="mb-4 text-sm font-semibold">On this page</h2>
            {toc.length ? (
              <nav className="space-y-1">
                {toc.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="block text-sm text-muted-foreground hover:text-foreground" style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                    {item.text}
                  </a>
                ))}
              </nav>
            ) : <p className="text-sm text-muted-foreground">No headings found.</p>}
            {relatedArticles.length > 0 && (
              <>
                <Separator className="my-6" />
                <h2 className="mb-3 text-sm font-semibold">Related Articles</h2>
                <nav className="space-y-1">
                  {relatedArticles.map((related) => (
                    <Link key={related.id} href={`/system-design/${related.slug}`} className="block rounded-lg p-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                      {related.title}
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}