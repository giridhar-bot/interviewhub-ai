import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Interview Experiences — Real Stories from Engineers",
  description:
    "Read real interview experiences from FAANG and top tech companies. Learn about interview rounds, questions, and preparation tips from engineers who were there.",
  path: "/community/experiences",
  keywords: ["interview experience", "FAANG interview", "Google interview", "Amazon interview"],
});

const experiences = [
  { title: "Google SDE-1 Interview — Selected after 4 rounds", company: "Google", role: "SDE-1", result: "Selected", rounds: 4, yoe: 2, time: "1 week ago", likes: 234, replies: 45, slug: "google-sde1-selected" },
  { title: "Amazon SDE-2 — Rejected at System Design", company: "Amazon", role: "SDE-2", result: "Rejected", rounds: 5, yoe: 4, time: "2 weeks ago", likes: 178, replies: 32, slug: "amazon-sde2-rejected" },
  { title: "Microsoft SWE Intern — Campus placement", company: "Microsoft", role: "Intern", result: "Selected", rounds: 3, yoe: 0, time: "2 weeks ago", likes: 156, replies: 28, slug: "microsoft-intern-campus" },
  { title: "Meta E4 — 6 months preparation journey", company: "Meta", role: "E4", result: "Selected", rounds: 5, yoe: 3, time: "3 weeks ago", likes: 312, replies: 67, slug: "meta-e4-selected" },
  { title: "Flipkart SDE-1 — Off-campus referral", company: "Flipkart", role: "SDE-1", result: "Selected", rounds: 4, yoe: 1, time: "1 month ago", likes: 189, replies: 34, slug: "flipkart-sde1-referral" },
  { title: "Uber SDE-2 — System Design focus", company: "Uber", role: "SDE-2", result: "Rejected", rounds: 5, yoe: 5, time: "1 month ago", likes: 145, replies: 22, slug: "uber-sde2-system-design" },
];

const resultColors: Record<string, string> = {
  Selected: "bg-green-50 text-green-600",
  Rejected: "bg-red-50 text-red-600",
};

export default function ExperiencesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Experiences", href: "/community/experiences" },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Interview{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Experiences
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Real interview stories from engineers. Learn what to expect and how to prepare.
          </p>
        </div>
        <Link href="/community/ask">
          <Button>Share Your Experience</Button>
        </Link>
      </div>

      {/* Company Filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["All", "Google", "Amazon", "Microsoft", "Meta", "Apple", "Flipkart", "Uber"].map((c) => (
          <Badge key={c} variant={c === "All" ? "default" : "outline"} className="cursor-pointer">
            {c}
          </Badge>
        ))}
      </div>

      {/* Experiences List */}
      <div className="mt-8 space-y-4">
        {experiences.map((exp) => (
          <Link key={exp.slug} href={`/community/discussions/${exp.slug}`}>
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{exp.title}</CardTitle>
                      <Badge className={resultColors[exp.result]}>{exp.result}</Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {exp.company} • {exp.role} • {exp.rounds} rounds • {exp.yoe} YoE • {exp.time}
                    </CardDescription>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>👍 {exp.likes}</span>
                    <span>💬 {exp.replies}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
