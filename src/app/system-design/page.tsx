import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { articleRepository } from "@/repositories/article.repository";

export const metadata = generateSEO({
  title: "System Design — HLD, LLD & Architecture",
  description: "Browse published system-design guides and case studies.",
  path: "/system-design",
  keywords: ["system design", "HLD", "LLD", "architecture", "scalability"],
});

export const dynamic = "force-dynamic";

export default async function SystemDesignPage() {
  const articles = await articleRepository.findPublishedByTopicCategory("System Design");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">System Design</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published high-level design, low-level design, and architecture material.
        </p>
      </div>

      {articles.length ? (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/system-design/${article.slug}`}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">{article.topic.name}</Badge>
                  <CardTitle className="mt-2 text-lg">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt ?? article.shortDescription ?? `${article.readTime} min read`}
                  </CardDescription>
                  {article.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {article.tags.slice(0, 4).map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No system-design articles have been published yet.
        </p>
      )}
    </div>
  );
}