import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import {
  CpuChipIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CommandLineIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "AI Analytics Dashboard",
  description: "Monitor AI usage, costs, performance, and safety metrics.",
  robots: { index: false, follow: false },
};

const aiModules = [
  { name: "AI Tutor", icon: SparklesIcon, description: "Concept explanations, doubt solving" },
  { name: "Mock Interview", icon: ChatBubbleLeftRightIcon, description: "Technical, behavioral, system design" },
  { name: "Resume ATS", icon: DocumentTextIcon, description: "Resume analysis and ATS scoring" },
  { name: "Code Review", icon: CommandLineIcon, description: "Code review and explanation" },
  { name: "Roadmap Generator", icon: AcademicCapIcon, description: "Personalized learning paths" },
  { name: "Study Planner", icon: BookOpenIcon, description: "Adaptive study schedules" },
  { name: "Quiz Generator", icon: BeakerIcon, description: "AI-generated MCQ questions" },
  { name: "Career Advisor", icon: ChartBarIcon, description: "Career guidance and advice" },
];

const metrics = [
  { label: "Total Requests Today", value: "0", icon: CpuChipIcon, change: "—" },
  { label: "Tokens Used Today", value: "0", icon: ClockIcon, change: "—" },
  { label: "Cost Today", value: "$0.00", icon: CurrencyDollarIcon, change: "—" },
  { label: "Safety Blocks", value: "0", icon: ShieldCheckIcon, change: "—" },
];

const costTiers = [
  { tier: "Fast (GPT-4o-mini)", usage: "Tutor, Doubt Solver, Flashcards, Quiz", cost: "$0.15/1K in + $0.60/1K out" },
  { tier: "Balanced (GPT-4o)", usage: "Code Review, Roadmap, Study Plan, Career", cost: "$2.50/1K in + $10/1K out" },
  { tier: "Premium (Claude Sonnet)", usage: "Mock Interview, Resume ATS, System Design", cost: "$3/1K in + $15/1K out" },
];

const usageLimits = [
  { plan: "FREE", requests: "20/day", tokens: "50K/day" },
  { plan: "PRO", requests: "200/day", tokens: "500K/day" },
  { plan: "ENTERPRISE", requests: "1,000/day", tokens: "2M/day" },
];

export default function AIAnalyticsDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor AI usage, costs, and performance across all modules
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Part 7: AI Architecture
        </Badge>
      </div>

      <Separator className="my-6" />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <metric.icon className="h-5 w-5 text-violet-600" />
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{metric.value}</CardTitle>
                  <span className="text-xs text-muted-foreground">{metric.change}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* AI Modules */}
      <h2 className="mt-10 text-xl font-bold">AI Modules</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aiModules.map((mod) => (
          <Card key={mod.name} className="transition-all hover:shadow-md hover:border-violet-200">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
                <mod.icon className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-sm">{mod.name}</CardTitle>
                <CardDescription className="text-xs">{mod.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Cost Tiers */}
      <h2 className="mt-10 text-xl font-bold">Model Cost Tiers</h2>
      <div className="mt-4 space-y-2">
        {costTiers.map((tier) => (
          <div key={tier.tier} className="flex items-center gap-4 rounded-lg border bg-card p-4">
            <div className="flex-1">
              <p className="font-medium">{tier.tier}</p>
              <p className="text-sm text-muted-foreground">{tier.usage}</p>
            </div>
            <Badge variant="secondary" className="text-xs font-mono">{tier.cost}</Badge>
          </div>
        ))}
      </div>

      {/* Usage Limits */}
      <h2 className="mt-10 text-xl font-bold">Usage Limits by Plan</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {usageLimits.map((limit) => (
          <Card key={limit.plan}>
            <CardHeader>
              <CardTitle className="text-lg">{limit.plan}</CardTitle>
              <CardDescription>
                <span className="block">{limit.requests} requests</span>
                <span className="block">{limit.tokens} tokens</span>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
