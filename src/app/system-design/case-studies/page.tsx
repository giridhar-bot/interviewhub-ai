import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { articleRepository } from "@/repositories/article.repository";

export const metadata = generateSEO({
  title: "System Design Case Studies",
  description: "Read published system-design case studies and architecture guides.",
  path: "/system-design/case-studies",
  keywords: ["system design case studies", "HLD", "LLD", "architecture"],
});

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const articles = await articleRepository.findPublishedByTopicCategory("System Design");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "System Design", href: "/system-design" },
              { name: "Case Studies", href: "/system-design/case-studies" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">System Design Case Studies</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published architecture guides from the learning library.
        </p>
      </div>

      {articles.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/system-design/${article.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-3">
                    {article.excerpt ?? article.shortDescription ?? `${article.readTime} min read`}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No system-design case studies have been published yet.
        </p>
      )}
    </div>
  );
}