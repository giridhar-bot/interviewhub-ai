import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { itemListJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { topicRepository } from "@/repositories/topic.repository";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Topics — Interview Preparation Library",
  description: "Browse published interview-preparation topics and their available content.",
  path: "/topics",
  keywords: ["interview topics", "tech interview preparation", "coding interview topics"],
});

export default async function TopicsPage() {
  const topics = await topicRepository.findPublishedDirectory();
  const topicsByCategory = new Map<string, typeof topics>();

  for (const topic of topics) {
    const categoryTopics = topicsByCategory.get(topic.category) ?? [];
    categoryTopics.push(topic);
    topicsByCategory.set(topic.category, categoryTopics);
  }

  const allTopics = topics.map((topic) => ({
    name: topic.name,
    url: `/topics/${topic.slug}`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Topics", href: "/topics" },
            ])
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd(allTopics)) }} />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Explore Topics</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published topics and the learning material currently available for each.
        </p>
      </div>

      {topics.length ? (
        <div className="mt-16 space-y-12">
          {Array.from(topicsByCategory.entries()).map(([category, categoryTopics]) => (
            <section key={category}>
              <h2 className="mb-6 text-2xl font-bold">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categoryTopics.map((topic) => (
                  <Link key={topic.id} href={`/topics/${topic.slug}`}>
                    <div className="group h-full rounded-xl border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md">
                      <h3 className="text-lg font-semibold group-hover:text-primary">{topic.name}</h3>
                      {topic.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">{topic._count.questions} questions</Badge>
                        <Badge variant="secondary" className="text-xs">{topic._count.articles} notes</Badge>
                        <Badge variant="secondary" className="text-xs">{topic._count.roadmaps} roadmaps</Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-16 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No published topics are available yet.
        </p>
      )}
    </div>
  );
}