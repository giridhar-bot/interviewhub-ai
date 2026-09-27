import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getProblemCategories, getProblemTags, getProblems } from "@/services/coding.service";

export const metadata = generateSEO({
  title: "DSA Practice — Data Structures & Algorithms",
  description: "Explore published data structures and algorithms problems by category and tag.",
  path: "/dsa",
  keywords: ["DSA", "data structures", "algorithms", "coding interview"],
});

export const dynamic = "force-dynamic";

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function DSAPage() {
  const [categories, tags, problemResult] = await Promise.all([
    getProblemCategories(),
    getProblemTags(),
    getProblems({ limit: 6 }),
  ]);
  const totalProblems = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "DSA", href: "/dsa" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">DSA Practice</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore published data structures and algorithms problems by category and tag.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-3 gap-4 rounded-2xl border bg-card p-6">
        {[
          { label: "Published Problems", value: totalProblems },
          { label: "Categories", value: categories.length },
          { label: "Problem Tags", value: tags.length },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Problem Categories</h2>
          <Link href="/coding/problems"><Button variant="outline">View All</Button></Link>
        </div>
        {categories.length ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} href={`/coding/problems?category=${encodeURIComponent(category.name)}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                    <Badge variant="secondary">{category.count}</Badge>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No published coding categories yet.
          </p>
        )}
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Problem Tags</h2>
          <Link href="/dsa/patterns"><Button variant="outline">View All Tags</Button></Link>
        </div>
        {tags.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.slice(0, 16).map((tag) => (
              <Link key={tag.name} href={`/dsa/patterns/${toSlug(tag.name)}`}>
                <Badge variant="secondary">{tag.name} · {tag.count}</Badge>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No problem tags have been published yet.
          </p>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">Published Problems</h2>
        {problemResult.problems.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problemResult.problems.map((problem) => (
              <Link key={problem.id} href={`/coding/problems/${problem.slug}`}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base">{problem.title}</CardTitle>
                    <CardDescription>{problem.category} · {problem.difficulty}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No coding problems have been published yet.
          </p>
        )}
      </section>
    </div>
  );
}