import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Resume Templates — Professional, Modern & ATS-Friendly",
  description:
    "Browse the resume layout presets currently available in the builder.",
  path: "/resume/templates",
  keywords: ["resume templates", "ATS-friendly resume", "professional resume", "resume design"],
});

const templates = [
  { name: "Modern Pro", slug: "modern-pro", category: "Modern", description: "Clean layout with a sidebar." },
  { name: "Classic", slug: "classic", category: "Traditional", description: "Traditional single-column layout." },
  { name: "Minimal", slug: "minimal", category: "Minimal", description: "Simple layout that keeps focus on your content." },
  { name: "Creative", slug: "creative", category: "Creative", description: "Layout with color accents." },
  { name: "Executive", slug: "executive", category: "Traditional", description: "Layout emphasizing experience and achievements." },
  { name: "Tech Stack", slug: "tech-stack", category: "Modern", description: "Layout for technical skills and projects." },
  { name: "Graduate", slug: "graduate", category: "Minimal", description: "Layout emphasizing education and early experience." },
  { name: "Compact", slug: "compact", category: "Minimal", description: "Compact layout for concise resumes." },
  { name: "Two Column", slug: "two-column", category: "Modern", description: "Two-column layout with a skills sidebar." },
  { name: "Academic", slug: "academic", category: "Traditional", description: "Academic CV layout for research and teaching." },
  { name: "Startup", slug: "startup", category: "Creative", description: "Flexible layout for startup roles." },
  { name: "FAANG Ready", slug: "faang-ready", category: "Modern", description: "Impact-focused layout for technical roles." },
];

const categories = ["All", "Modern", "Traditional", "Minimal", "Creative"];

export default function ResumeTemplatesPage() {
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
          <Card key={t.slug} className="group cursor-pointer transition-all hover:shadow-lg hover:border-violet-200">
            <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-muted/50 to-muted">
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Template Preview
              </div>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.name}</CardTitle>
              </div>
              <CardDescription className="text-xs">{t.description}</CardDescription>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">{t.category}</Badge>
                <Link href={`/resume/builder?template=${t.slug}`}>
                  <Button size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                    Use Template
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
