import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import {
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  UserIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

export const metadata = generateSEO({
  title: "Interview Preparation — Technical, HR & Coding",
  description:
    "Prepare for technical, HR, and coding interviews with curated questions, tips, AI mock interviews, and real interview experiences. 10,000+ questions across 50+ topics.",
  path: "/interview",
  keywords: ["interview preparation", "technical interview", "HR interview", "coding interview", "mock interview", "interview questions"],
});

const interviewTypes = [
  {
    title: "Technical Interview",
    description:
      "Deep-dive into data structures, algorithms, system design, and technology-specific questions.",
    icon: CodeBracketIcon,
    href: "/interview/technical",
    badge: "Most Popular",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "HR Interview",
    description:
      "Behavioral questions, salary negotiation, STAR method, and common HR round preparation.",
    icon: UserIcon,
    href: "/interview/hr",
    badge: "Essential",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Coding Round",
    description:
      "Practice coding problems with an online editor, test cases, and time tracking.",
    icon: AcademicCapIcon,
    href: "/coding",
    badge: "Practice",
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "AI Mock Interview",
    description:
      "Practice with our AI interviewer. Get real-time feedback on your answers and communication.",
    icon: ChatBubbleLeftRightIcon,
    href: "/ai-tools/mock-interview",
    badge: "AI Powered",
    color: "from-violet-500 to-purple-500",
  },
];

const popularTopics = [
  "Java", "React", "Spring Boot", "AWS", "JavaScript",
  "Python", "Node.js", "SQL", "System Design", "Docker",
  "TypeScript", "SAP", ".NET", "Kubernetes", "Angular",
];

export default function InterviewPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Interview{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Preparation
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to ace your next tech interview — from HR rounds
          to system design.
        </p>
      </div>

      {/* Interview Types */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {interviewTypes.map((type) => (
          <Link key={type.title} href={type.href}>
            <Card className="group h-full cursor-pointer transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${type.color} shadow-lg`}
                  >
                    <type.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                    {type.badge}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-xl group-hover:text-violet-600">
                  {type.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {type.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Popular Topics */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold">Popular Interview Topics</h2>
        <p className="mt-2 text-muted-foreground">
          Quick access to the most searched interview questions
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {popularTopics.map((topic) => (
            <Link
              key={topic}
              href={`/topics/${topic.toLowerCase().replace(/[\s.]+/g, "-")}`}
            >
              <Badge
                variant="outline"
                className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"
              >
                {topic} Interview Questions
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
