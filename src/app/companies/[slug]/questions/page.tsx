import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return generateSEO({
    title: `${name} Interview Questions — Coding, System Design, HR`,
    description: `Browse interview questions asked at ${name}. Filter by type, difficulty, and topic. Practice with real questions from recent interviews.`,
    path: `/companies/${slug}/questions`,
  });
}

const questions = [
  { title: "Two Sum", type: "Coding", difficulty: "Easy", frequency: "Very High", slug: "two-sum" },
  { title: "Design a URL Shortener", type: "System Design", difficulty: "Medium", frequency: "High", slug: "url-shortener" },
  { title: "LRU Cache", type: "Coding", difficulty: "Medium", frequency: "High", slug: "lru-cache" },
  { title: "Tell me about yourself", type: "HR", difficulty: "Easy", frequency: "Very High", slug: "tell-about-yourself" },
  { title: "Merge K Sorted Lists", type: "Coding", difficulty: "Hard", frequency: "Medium", slug: "merge-k-sorted-lists" },
  { title: "Design WhatsApp", type: "System Design", difficulty: "Hard", frequency: "Medium", slug: "design-whatsapp" },
  { title: "Time you failed", type: "Behavioral", difficulty: "Medium", frequency: "High", slug: "time-you-failed" },
  { title: "Binary Tree Max Path Sum", type: "Coding", difficulty: "Hard", frequency: "Medium", slug: "binary-tree-max-path" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

const typeColors: Record<string, string> = {
  Coding: "bg-blue-50 text-blue-600",
  "System Design": "bg-purple-50 text-purple-600",
  Behavioral: "bg-orange-50 text-orange-600",
  HR: "bg-green-50 text-green-600",
};

export default async function CompanyQuestionsPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Companies", href: "/companies" },
              { name, href: `/companies/${slug}` },
              { name: "Questions", href: `/companies/${slug}/questions` },
            ])
          ),
        }}
      />

      <h1 className="text-3xl font-extrabold tracking-tight">
        {name}{" "}
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Interview Questions
        </span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Real questions asked in {name} interviews, sorted by frequency.
      </p>

      {/* Filter badges */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["All", "Coding", "System Design", "Behavioral", "HR"].map((type) => (
          <Badge
            key={type}
            variant={type === "All" ? "default" : "outline"}
            className="cursor-pointer"
          >
            {type}
          </Badge>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Question</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.slug} className="cursor-pointer border-b transition-colors hover:bg-muted/30 last:border-0">
                <td className="px-6 py-4 font-medium">{q.title}</td>
                <td className="px-6 py-4">
                  <Badge className={typeColors[q.type]}>{q.type}</Badge>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{q.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
