import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Resume Templates — Professional, Modern & ATS-Friendly",
  description:
    "Choose from 12+ professionally designed resume templates. All templates are ATS-optimized and customizable. Modern, classic, and minimal designs.",
  path: "/resume/templates",
  keywords: ["resume templates", "ATS-friendly resume", "professional resume", "resume design"],
});

const templates = [
  { name: "Modern Pro", slug: "modern-pro", category: "Modern", atsScore: 95, popular: true, description: "Clean, modern design with sidebar layout. Perfect for tech roles." },
  { name: "Classic", slug: "classic", category: "Traditional", atsScore: 98, popular: true, description: "Traditional single-column layout. Highest ATS compatibility." },
  { name: "Minimal", slug: "minimal", category: "Minimal", atsScore: 96, popular: false, description: "Simple and elegant. Lets your content shine without distractions." },
  { name: "Creative", slug: "creative", category: "Creative", atsScore: 85, popular: false, description: "Bold design with color accents. Great for design and marketing roles." },
  { name: "Executive", slug: "executive", category: "Traditional", atsScore: 94, popular: false, description: "Sophisticated layout for senior positions. Emphasis on achievements." },
  { name: "Tech Stack", slug: "tech-stack", category: "Modern", atsScore: 92, popular: true, description: "Optimized for developers. Highlights technical skills and projects." },
  { name: "Graduate", slug: "graduate", category: "Minimal", atsScore: 97, popular: false, description: "Perfect for fresh graduates. Emphasizes education and internships." },
  { name: "Compact", slug: "compact", category: "Minimal", atsScore: 95, popular: false, description: "Fits more content in less space. Ideal for experienced professionals." },
  { name: "Two Column", slug: "two-column", category: "Modern", atsScore: 90, popular: false, description: "Balanced two-column layout with skills sidebar. Great visual hierarchy." },
  { name: "Academic", slug: "academic", category: "Traditional", atsScore: 96, popular: false, description: "Academic CV format with publications, research, and teaching sections." },
  { name: "Startup", slug: "startup", category: "Creative", atsScore: 88, popular: false, description: "Dynamic layout for startup culture. Shows innovation and impact." },
  { name: "FAANG Ready", slug: "faang-ready", category: "Modern", atsScore: 94, popular: true, description: "Optimized format used by FAANG employees. Impact-driven bullet points." },
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
          Choose a template, customize it, and export. All templates are ATS-optimized.
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
              {t.popular && (
                <Badge className="absolute top-2 right-2 bg-violet-600">Popular</Badge>
              )}
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  ATS: {t.atsScore}%
                </Badge>
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
