import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return generateSEO({
    title: `${name} Interview Experiences — Real Stories & Tips`,
    description: `Read real interview experiences from ${name} candidates. Learn about interview rounds, questions asked, and preparation tips.`,
    path: `/companies/${slug}/experiences`,
  });
}

const experiences = [
  { id: 1, role: "SDE-1", result: "Selected", rounds: 4, yoe: 2, date: "Jan 2025", author: "Anonymous",
    summary: "4 rounds: Online Assessment, DSA Round, System Design, HR. Focus on arrays, trees, and basic system design." },
  { id: 2, role: "SDE-2", result: "Rejected", rounds: 5, yoe: 4, date: "Dec 2024", author: "Anonymous",
    summary: "5 rounds including 2 DSA, 1 System Design (HLD+LLD), 1 Hiring Manager, 1 HR. Got rejected at System Design round." },
  { id: 3, role: "SDE-1", result: "Selected", rounds: 4, yoe: 1, date: "Nov 2024", author: "Anonymous",
    summary: "Online test with 3 coding questions (1 easy, 1 medium, 1 hard), followed by 2 technical interviews and HR." },
  { id: 4, role: "SDE-3", result: "Selected", rounds: 6, yoe: 6, date: "Oct 2024", author: "Anonymous",
    summary: "6 rounds: Phone Screen, 2 Coding, 2 System Design (HLD+LLD), Bar Raiser. Heavy focus on system design and leadership." },
  { id: 5, role: "SDE-1", result: "Rejected", rounds: 3, yoe: 0, date: "Sep 2024", author: "Anonymous",
    summary: "Campus placement: 1 online test + 2 interviews. Got rejected after technical round. Questions were medium-hard level DSA." },
];

const resultColors: Record<string, string> = {
  Selected: "bg-green-50 text-green-600",
  Rejected: "bg-red-50 text-red-600",
};

export default async function CompanyExperiencesPage({ params }: Props) {
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
              { name: "Experiences", href: `/companies/${slug}/experiences` },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {name}{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Interview Experiences
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Real interview experiences shared by candidates who interviewed at {name}.
          </p>
        </div>
        <Button>Share Your Experience</Button>
      </div>

      <div className="mt-8 space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id} className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{exp.role} Interview</CardTitle>
                  <Badge className={resultColors[exp.result]}>{exp.result}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">{exp.date}</span>
              </div>
              <CardDescription className="mt-1">
                {exp.rounds} rounds • {exp.yoe} years experience
              </CardDescription>
              <p className="mt-3 text-sm">{exp.summary}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
