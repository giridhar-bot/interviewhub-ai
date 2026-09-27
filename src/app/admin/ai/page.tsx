import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { analyticsRepository } from "@/repositories/analytics.repository";
import {
  CpuChipIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CommandLineIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Analytics Dashboard",
  description: "Monitor recorded AI usage, cost, and token metrics.",
  robots: { index: false, follow: false },
};

const aiModules = [
  { name: "AI Tutor", icon: SparklesIcon, description: "Concept explanations and doubt solving" },
  { name: "Mock Interview", icon: ChatBubbleLeftRightIcon, description: "Technical, behavioral, and system design" },
  { name: "Resume ATS", icon: DocumentTextIcon, description: "Resume analysis and ATS scoring" },
  { name: "Code Review", icon: CommandLineIcon, description: "Code review and explanation" },
  { name: "Roadmap Generator", icon: AcademicCapIcon, description: "Personalized learning paths" },
  { name: "Study Planner", icon: BookOpenIcon, description: "Adaptive study schedules" },
  { name: "Quiz Generator", icon: BeakerIcon, description: "Quiz generation" },
  { name: "Career Advisor", icon: ChartBarIcon, description: "Career guidance" },
];

export default async function AIAnalyticsDashboard() {
  const usage = await analyticsRepository.getAIUsageOverview();
  const metrics = [
    { label: "Requests Today", value: usage.requests.toLocaleString(), icon: CpuChipIcon },
    { label: "Tokens Today", value: usage.tokens.toLocaleString(), icon: ClockIcon },
    { label: "Recorded Cost Today", value: usage.cost.toFixed(4), icon: CurrencyDollarIcon },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Analytics</h1>
        <p className="mt-1 text-muted-foreground">Usage recorded for today</p>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <metric.icon className="h-5 w-5 text-primary" />
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-2xl">{metric.value}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold">AI Modules</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {aiModules.map((module) => (
          <Card key={module.name}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <module.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm">{module.name}</CardTitle>
                <CardDescription className="text-xs">{module.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Usage by Model</h2>
        {usage.models.length ? (
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Model</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Requests</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Tokens</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Recorded Cost</th>
                </tr>
              </thead>
              <tbody>
                {usage.models.map((model) => (
                  <tr key={model.model} className="border-b last:border-0">
                    <td className="px-4 py-2 text-sm font-medium">{model.model}</td>
                    <td className="px-4 py-2 text-sm">{model.requests.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{model.tokens.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{model.cost.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No AI usage has been recorded today.
          </p>
        )}
      </section>
    </div>
  );
}