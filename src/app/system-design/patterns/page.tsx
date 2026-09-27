import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { articleRepository } from "@/repositories/article.repository";

export const metadata = generateSEO({
  title: "System Design Patterns & Topics",
  description: "Browse tags on published system-design articles.",
  path: "/system-design/patterns",
  keywords: ["design patterns", "software architecture", "system design"],
});

export const dynamic = "force-dynamic";

export default async function DesignPatternsPage() {
  const articles = await articleRepository.findPublishedByTopicCategory("System Design");
  const tagArticles = new Map<string, typeof articles>();

  for (const article of articles) {
    for (const tag of article.tags) {
      const matches = tagArticles.get(tag) ?? [];
      matches.push(article);
      tagArticles.set(tag, matches);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "System Design", href: "/system-design" },
              { name: "Patterns", href: "/system-design/patterns" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">System Design Topics</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tags and articles from the published System Design library.
        </p>
      </div>

      {tagArticles.size ? (
        <div className="mt-16 space-y-12">
          {Array.from(tagArticles.entries()).map(([tag, taggedArticles]) => (
            <section key={tag}>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 rounded bg-primary" />
                <h2 className="text-2xl font-bold">{tag}</h2>
                <Badge variant="secondary">{taggedArticles.length} articles</Badge>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {taggedArticles.map((article) => (
                  <Link key={article.id} href={`/system-design/${article.slug}`}>
                    <Card className="h-full transition-all hover:shadow-md">
                      <CardHeader>
                        <CardTitle className="text-base">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {article.excerpt ?? article.shortDescription ?? `${article.readTime} min read`}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No tagged system-design articles have been published yet.
        </p>
      )}
    </div>
  );
}