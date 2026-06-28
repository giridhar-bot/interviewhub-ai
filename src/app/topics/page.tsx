import { topicCategories } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { itemListJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Topics — Explore 50+ Tech Stacks",
  description:
    "Browse interview preparation content for Java, React, AWS, SAP, System Design, and 50+ technology topics. Notes, roadmaps, cheat sheets & coding problems.",
  path: "/topics",
  keywords: [
    "interview topics",
    "tech interview preparation",
    "Java interview",
    "React interview",
    "AWS interview",
    "SAP interview",
    "coding interview topics",
  ],
});

const allTopics = topicCategories.flatMap((c) =>
  c.topics.map((t) => ({
    name: t, url: `/topics/${t.toLowerCase().replace(/[\s.]+/g, "-")}`,
  }))
);

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Topics", href: "/topics" },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListJsonLd(allTopics)),
        }}
      />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Explore{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Topics
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose a technology to start your interview preparation journey. Each
          topic has curated notes, questions, roadmaps, and cheat sheets.
        </p>
      </div>

      <div className="mt-16 space-y-12">
        {topicCategories.map((category) => (
          <div key={category.title}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.bgColor}`}
              >
                <category.icon className={`h-5 w-5 ${category.color}`} />
              </div>
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {category.topics.map((topic) => {
                const slug = topic.toLowerCase().replace(/[\s.]+/g, "-");
                return (
                  <Link key={topic} href={`/topics/${slug}`}>
                    <div className="group rounded-xl border bg-card p-5 transition-all duration-300 hover:border-violet-200 hover:shadow-md">
                      <h3 className="text-lg font-semibold group-hover:text-violet-600">
                        {topic}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Interview questions, notes & roadmap
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Questions
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Notes
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
