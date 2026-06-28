import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import {
  BookOpenIcon,
  MapIcon,
  RectangleStackIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  TrophyIcon,
  SparklesIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export const metadata = generateSEO({
  title: "Learn — Notes, Roadmaps, Flashcards & Quizzes",
  description:
    "Master tech interview topics with structured notes, interactive roadmaps, spaced-repetition flashcards, and timed quizzes. Track your progress and earn XP.",
  path: "/learn",
  keywords: [
    "learn programming",
    "tech interview notes",
    "roadmaps",
    "flashcards",
    "coding quizzes",
    "interview preparation",
    "spaced repetition",
  ],
});

const modules = [
  {
    title: "Notes",
    description: "In-depth articles with MDX, code examples, diagrams, and interview questions.",
    href: "/learn/notes",
    icon: BookOpenIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    count: "500+",
  },
  {
    title: "Roadmaps",
    description: "Step-by-step learning paths for Java, React, AWS, System Design, and more.",
    href: "/learn/roadmaps",
    icon: MapIcon,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    count: "20+",
  },
  {
    title: "Flashcards",
    description: "Spaced-repetition flashcard decks to boost retention. Review daily.",
    href: "/learn/flashcards",
    icon: RectangleStackIcon,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    count: "1000+",
  },
  {
    title: "Quizzes",
    description: "Timed MCQ quizzes across all topics. Earn XP and climb the leaderboard.",
    href: "/learn/quizzes",
    icon: AcademicCapIcon,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    count: "200+",
  },
  {
    title: "Cheat Sheets",
    description: "Quick-reference guides for syntax, commands, patterns, and best practices.",
    href: "/learn/cheat-sheets",
    icon: DocumentTextIcon,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    count: "50+",
  },
  {
    title: "Leaderboard",
    description: "See how you rank. Earn XP, badges, and achievements through learning.",
    href: "/learn/leaderboard",
    icon: TrophyIcon,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    count: "Top 100",
  },
];

const features = [
  { icon: SparklesIcon, title: "AI-Powered", description: "AI generates flashcards, quizzes, and summaries for any topic." },
  { icon: ClockIcon, title: "Spaced Repetition", description: "SM-2 algorithm ensures you review cards at the optimal time." },
  { icon: TrophyIcon, title: "Gamified", description: "Earn XP, unlock badges, maintain streaks, and compete on the leaderboard." },
  { icon: MapIcon, title: "Structured Paths", description: "Follow curated roadmaps from beginner to expert for every tech stack." },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
          ])),
        }}
      />

      {/* Hero */}
      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4">
          Learn &middot; Practice &middot; Master
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Your Learning Hub
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Structured content, interactive tools, and AI assistance to help you
          ace every tech interview.
        </p>
      </div>

      {/* Module Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link key={mod.title} href={mod.href}>
            <Card className="group h-full transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${mod.bgColor}`}>
                    <mod.icon className={`h-6 w-6 ${mod.color}`} />
                  </div>
                  <Badge variant="secondary">{mod.count}</Badge>
                </div>
                <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                  {mod.title}
                </CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Features */}
      <div className="mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold">
          Why Learn with InterviewHub AI?
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link href="/learn/notes">
          <Button size="lg">Start Learning</Button>
        </Link>
      </div>
    </div>
  );
}
