import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getResumeTemplateCatalog } from "@/services/resume-template.service";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Resume Templates — Professional, Modern & ATS-Friendly",
  description: "Browse the resume layout presets currently available in the builder.",
  path: "/resume/templates",
  keywords: ["resume templates", "ATS-friendly resume", "professional resume", "resume design"],
});

const categories = ["All", "Modern", "Traditional", "Minimal", "Creative"];

export default async function ResumeTemplatesPage() {
  const templates = await getResumeTemplateCatalog();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Resume", href: "/resume" },
              { name: "Templates", href: "/resume/templates" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Resume{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Templates
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose an available layout preset to start building your resume.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mt-8 flex justify-center gap-2">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={cat === "All" ? "default" : "outline"}
            className="cursor-pointer px-4 py-1"
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card
            key={t.slug}
            className="group cursor-pointer transition-all hover:shadow-lg hover:border-violet-200"
          >
            <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-muted/50 to-muted">
              <div
                className="mx-auto flex h-full max-w-56 flex-col justify-center gap-2 p-4"
                aria-label={`${t.name} section outline`}
              >
                {t.sections.slice(0, 5).map((section) => (
                  <div
                    key={section}
                    className="border-b border-border/70 pb-1 text-xs font-medium text-muted-foreground"
                  >
                    {section}
                  </div>
                ))}
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.name}</CardTitle>
              </div>
              <CardDescription className="text-xs">{t.description}</CardDescription>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {t.category}
                </Badge>
                <Link href={`/resume/builder?template=${t.slug}`}>
                  <Button size="sm">Use Template</Button>
                </Link>
              </div>
              {!templates.length && (
                <p className="mt-8 rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                  No resume template outlines have been published yet.
                </p>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
