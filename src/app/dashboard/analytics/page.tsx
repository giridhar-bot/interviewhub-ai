import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guard";
import { getUserCodingStats } from "@/services/coding.service";
import { getUserActivityCalendar, getUserLearningProgress } from "@/services/progress.service";

export const metadata = generateSEO({
  title: "Learning Analytics — Track Your Progress",
  description: "Review your saved learning progress, coding results, and XP activity.",
  path: "/dashboard/analytics",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await requireAuth();
  const [learning, coding, activity] = await Promise.all([
    getUserLearningProgress(user.id),
    getUserCodingStats(user.id),
    getUserActivityCalendar(user.id, 7),
  ]);

  const completedTopics = learning.topicProgress.filter((progress) => progress.completed).length;
  const studyMinutes = learning.topicProgress.reduce((sum, progress) => sum + progress.totalStudyMins, 0);
  const recentDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    const isoDate = date.toISOString().slice(0, 10);
    const day = activity.entries.find((entry) => entry.date === isoDate);
    return { date: isoDate, count: day?.count ?? 0, xp: day?.xp ?? 0 };
  });

  const learningStats = [
    { label: "Topics Completed", value: `${completedTopics}/${learning.topicProgress.length}` },
    { label: "Study Time", value: `${Math.floor(studyMinutes / 60)}h ${studyMinutes % 60}m` },
    { label: "Articles Read", value: learning.totalArticlesRead.toLocaleString() },
    { label: "Quizzes Taken", value: learning.totalQuizzesTaken.toLocaleString() },
  ];
  const codingStats = [
    { label: "Problems Solved", value: coding.problemsSolved.toLocaleString() },
    { label: "Easy / Medium / Hard", value: `${coding.difficulty.easy} / ${coding.difficulty.medium} / ${coding.difficulty.hard}` },
    { label: "Total Submissions", value: coding.totalSubmissions.toLocaleString() },
    { label: "XP Events (7 days)", value: recentDays.reduce((sum, day) => sum + day.count, 0).toLocaleString() },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Learning Analytics</h1>
      <p className="mt-1 text-muted-foreground">Progress recorded for your account.</p>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Learning Progress</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {learningStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Coding Progress</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {codingStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-bold">Topic Progress</h2>
          {learning.topicProgress.length ? (
            <Card className="mt-4">
              <div className="space-y-4 p-6">
                {learning.topicProgress.map((progress) => (
                  <div key={progress.topicId}>
                    <div className="flex items-center justify-between text-sm">
                      <Link href={`/topics/${progress.topic.slug}`} className="hover:text-primary">{progress.topic.name}</Link>
                      <span className="font-medium">{Math.round(progress.completion)}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, progress.completion)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No topic progress has been recorded yet.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold">XP Activity · Past 7 Days</h2>
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Day</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">XP Events</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">XP Earned</th>
                </tr>
              </thead>
              <tbody>
                {recentDays.map((day) => (
                  <tr key={day.date} className="border-b last:border-0">
                    <td className="px-3 py-2 text-sm font-medium">{new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en", { weekday: "short", timeZone: "UTC" })}</td>
                    <td className="px-3 py-2 text-sm">{day.count}</td>
                    <td className="px-3 py-2 text-sm">{day.xp.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}