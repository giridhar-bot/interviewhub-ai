import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Activity Heatmap — Your Learning Consistency",
  description: "Visualize your daily learning activity with a GitHub-style heatmap.",
  path: "/dashboard/heatmap",
  noIndex: true,
});

// Generate sample heatmap data for 12 months
const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const activityLevels = [
  { level: 0, color: "bg-muted", label: "No activity" },
  { level: 1, color: "bg-green-200", label: "1-2 activities" },
  { level: 2, color: "bg-green-400", label: "3-5 activities" },
  { level: 3, color: "bg-green-600", label: "6-9 activities" },
  { level: 4, color: "bg-green-800", label: "10+ activities" },
];

const streakStats = [
  { label: "Current Streak", value: "18 days", icon: "🔥" },
  { label: "Longest Streak", value: "45 days", icon: "🏆" },
  { label: "Total Active Days", value: "186", icon: "📅" },
  { label: "Avg Daily Activity", value: "4.2", icon: "📊" },
];

const monthlyBreakdown = [
  { month: "Jun 2026", problems: 32, study: 28, flashcards: 120, quizzes: 8, totalDays: 22 },
  { month: "May 2026", problems: 28, study: 25, flashcards: 95, quizzes: 6, totalDays: 20 },
  { month: "Apr 2026", problems: 35, study: 30, flashcards: 140, quizzes: 10, totalDays: 25 },
  { month: "Mar 2026", problems: 22, study: 18, flashcards: 80, quizzes: 5, totalDays: 15 },
  { month: "Feb 2026", problems: 18, study: 15, flashcards: 60, quizzes: 4, totalDays: 12 },
  { month: "Jan 2026", problems: 25, study: 20, flashcards: 100, quizzes: 7, totalDays: 18 },
];

export default function HeatmapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Activity{" "}
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Heatmap
        </span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Visualize your learning consistency over the past year.
      </p>

      {/* Streak Stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        {streakStats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <CardDescription>{s.label}</CardDescription>
                  <CardTitle className="text-xl">{s.value}</CardTitle>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Heatmap Grid */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Contribution Graph</CardTitle>
          <CardDescription>365 activities in the last year</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          {/* Month labels */}
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
          {/* Heatmap placeholder grid */}
          <div className="flex gap-[3px]">
            {Array.from({ length: 52 }).map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const level = Math.floor(Math.random() * 5);
                  return (
                    <div
                      key={dayIdx}
                      className={`h-3 w-3 rounded-sm ${activityLevels[level].color}`}
                      title={`${activityLevels[level].label}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            {activityLevels.map((l) => (
              <div key={l.level} className={`h-3 w-3 rounded-sm ${l.color}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </Card>

      {/* Monthly Breakdown */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Monthly Breakdown</h2>
        <div className="mt-4 overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Month</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Problems</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Study Sessions</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Flashcards</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Quizzes</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Active Days</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBreakdown.map((m) => (
                <tr key={m.month} className="border-b last:border-0">
                  <td className="px-6 py-4 text-sm font-medium">{m.month}</td>
                  <td className="px-6 py-4 text-sm">{m.problems}</td>
                  <td className="px-6 py-4 text-sm">{m.study}</td>
                  <td className="px-6 py-4 text-sm">{m.flashcards}</td>
                  <td className="px-6 py-4 text-sm">{m.quizzes}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge variant="secondary">{m.totalDays}/30</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
