import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Learning Analytics — Track Your Progress",
  description: "Detailed analytics on your learning journey, coding practice, and interview readiness.",
  path: "/dashboard/analytics",
  noIndex: true,
});

const learningStats = [
  { label: "Topics Completed", value: "12/25", change: "+3 this week" },
  { label: "Total Study Time", value: "48h", change: "+6h this week" },
  { label: "Quiz Accuracy", value: "76%", change: "+4% this month" },
  { label: "Flashcards Reviewed", value: "450", change: "+85 this week" },
];

const codingStats = [
  { label: "Problems Solved", value: "87", change: "+12 this week" },
  { label: "Easy / Medium / Hard", value: "35 / 40 / 12", change: "" },
  { label: "Acceptance Rate", value: "68%", change: "+2% this month" },
  { label: "Contest Rating", value: "1450", change: "+50 this month" },
];

const readinessScores = [
  { topic: "DSA", score: 72, color: "bg-blue-500" },
  { topic: "System Design", score: 58, color: "bg-purple-500" },
  { topic: "Behavioral", score: 85, color: "bg-green-500" },
  { topic: "HR", score: 90, color: "bg-orange-500" },
  { topic: "Java", score: 78, color: "bg-red-500" },
  { topic: "React", score: 65, color: "bg-cyan-500" },
];

const weeklyActivity = [
  { day: "Mon", problems: 3, study: 2, revision: 1 },
  { day: "Tue", problems: 5, study: 1.5, revision: 2 },
  { day: "Wed", problems: 2, study: 3, revision: 0 },
  { day: "Thu", problems: 4, study: 2, revision: 1 },
  { day: "Fri", problems: 6, study: 1, revision: 2 },
  { day: "Sat", problems: 8, study: 4, revision: 3 },
  { day: "Sun", problems: 3, study: 2, revision: 1 },
];

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Learning{" "}
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Analytics
        </span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Track your progress, identify weak areas, and optimize your preparation.
      </p>

      {/* Learning Stats */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Learning Progress</h2>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {learningStats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-2xl">{s.value}</CardTitle>
                {s.change && <span className="text-xs text-green-600">{s.change}</span>}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Coding Stats */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Coding Progress</h2>
        <div className="mt-4 grid grid-cols-4 gap-4">
          {codingStats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="pb-2">
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-2xl">{s.value}</CardTitle>
                {s.change && <span className="text-xs text-green-600">{s.change}</span>}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Interview Readiness */}
        <div>
          <h2 className="text-lg font-bold">Interview Readiness</h2>
          <Card className="mt-4">
            <div className="space-y-4 p-6">
              {readinessScores.map((r) => (
                <div key={r.topic}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{r.topic}</span>
                    <span className="font-medium">{r.score}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${r.color}`}
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Weekly Activity */}
        <div>
          <h2 className="text-lg font-bold">This Week</h2>
          <Card className="mt-4">
            <div className="p-6">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Day</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Problems</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Study (hrs)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Revision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyActivity.map((a) => (
                      <tr key={a.day} className="border-b last:border-0">
                        <td className="px-3 py-2 text-sm font-medium">{a.day}</td>
                        <td className="px-3 py-2 text-sm">{a.problems}</td>
                        <td className="px-3 py-2 text-sm">{a.study}h</td>
                        <td className="px-3 py-2 text-sm">{a.revision}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Heatmap Placeholder */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Activity Heatmap</h2>
        <Card className="mt-4">
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">GitHub-style activity heatmap will render here</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
