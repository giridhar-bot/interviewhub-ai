import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getProblemTags } from "@/services/coding.service";

export const metadata = generateSEO({
  title: "Algorithm Patterns — Coding Problem Tags",
  description: "Browse problem-solving tags used by published coding problems.",
  path: "/dsa/patterns",
  keywords: ["algorithm patterns", "coding patterns", "problem solving"],
});

export const dynamic = "force-dynamic";

function toSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function DSAPatternsPage() {
  const patterns = await getProblemTags();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "DSA", href: "/dsa" },
              { name: "Patterns", href: "/dsa/patterns" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Coding Problem Tags</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse tags attached to published coding problems.
        </p>
      </div>

      {patterns.length ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <Link key={pattern.name} href={`/dsa/patterns/${toSlug(pattern.name)}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                    <Badge variant="secondary">{pattern.count} problems</Badge>
                  </div>
                  <CardDescription>Tag on published coding problems.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-12 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No tagged coding problems have been published yet.
        </p>
      )}
    </div>
  );
}