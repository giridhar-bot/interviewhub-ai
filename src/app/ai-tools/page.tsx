import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export const metadata = generateSEO({
  title: "AI Tools — Tutor, Mock Interview & Resume Review",
  description:
    "Use AI-powered tools for interview preparation — AI Tutor, Mock Interviews, Resume Review, ATS Score Checker, and personalized Study Planner.",
  path: "/ai-tools",
  keywords: ["AI tutor", "mock interview", "resume review", "ATS checker", "study planner", "AI interview prep"],
});

const tools = [
  {
    title: "AI Tutor",
    description:
      "Ask any technical question and get instant, detailed explanations. Works like having a personal mentor 24/7.",
    icon: SparklesIcon,
    href: "/ai-tools/tutor",
    badge: "Popular",
    color: "from-violet-500 to-purple-600",
    features: ["Instant answers", "Code examples", "Follow-up questions", "Multi-language support"],
  },
  {
    title: "AI Mock Interview",
    description:
      "Practice with our AI interviewer that adapts to your experience level and target role. Get real-time feedback.",
    icon: ChatBubbleLeftRightIcon,
    href: "/ai-tools/mock-interview",
    badge: "Premium",
    color: "from-blue-500 to-cyan-500",
    features: ["Role-specific questions", "Real-time feedback", "Performance score", "Improvement tips"],
  },
  {
    title: "ATS Resume Review",
    description:
      "Upload your resume and get instant ATS compatibility score, keyword analysis, and improvement suggestions.",
    icon: DocumentTextIcon,
    href: "/ai-tools/resume-review",
    badge: "Premium",
    color: "from-green-500 to-emerald-500",
    features: ["ATS score", "Keyword optimization", "Format check", "Industry benchmarks"],
  },
  {
    title: "AI Study Planner",
    description:
      "Tell us your target company, timeline, and experience — AI creates a personalized daily study plan.",
    icon: CalendarDaysIcon,
    href: "/ai-tools/study-planner",
    badge: "New",
    color: "from-orange-500 to-amber-500",
    features: ["Personalized schedule", "Progress tracking", "Adaptive difficulty", "Reminders"],
  },
];

export default function AIToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          AI-Powered
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          AI{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Tools
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Supercharge your interview preparation with AI-powered tools designed
          to help you practice, learn, and improve faster.
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href}>
            <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-violet-200">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg`}
                  >
                    <tool.icon className="h-7 w-7 text-white" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    {tool.badge}
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-xl group-hover:text-violet-600">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {tool.description}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
