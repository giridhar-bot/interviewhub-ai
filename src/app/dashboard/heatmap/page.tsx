import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSEO } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-guard";
import { getUserActivityCalendar } from "@/services/progress.service";
import { userRepository } from "@/repositories/user.repository";

export const metadata = generateSEO({
  title: "Activity Heatmap — Your Learning Consistency",
  description: "View your recorded XP activity over the past year.",
  path: "/dashboard/heatmap",
  noIndex: true,
});

export const dynamic = "force-dynamic";

function activityColor(count: number) {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-green-200";
  if (count <= 3) return "bg-green-400";
  if (count <= 6) return "bg-green-600";
  return "bg-green-800";
}

export default async function HeatmapPage() {
  const user = await requireAuth();
  const [activity, profile] = await Promise.all([
    getUserActivityCalendar(user.id),
    userRepository.getProfileById(user.id),
  ]);

  const today = new Date();
  const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const firstDate = new Date(endDate);
  firstDate.setUTCDate(firstDate.getUTCDate() - 364);
  const activityByDate = new Map(activity.entries.map((entry) => [entry.date, entry.count]));
  const calendar = Array.from({ length: 365 }, (_, index) => {
    const date = new Date(firstDate);
    date.setUTCDate(firstDate.getUTCDate() + index);
    const isoDate = date.toISOString().slice(0, 10);
    const count = activityByDate.get(isoDate) ?? 0;
    return { isoDate, count };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Activity Heatmap</h1>
      <p className="mt-1 text-muted-foreground">Your recorded XP activity over the past year.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Current Streak", value: `${profile?.streak ?? 0} days` },
          { label: "Longest Streak", value: `${activity.longestStreak} days` },
          { label: "Total Active Days", value: activity.activeDays.toLocaleString() },
          { label: "XP Events", value: activity.totalEvents.toLocaleString() },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Contribution Graph</CardTitle>
          <CardDescription>{activity.totalEvents} XP events in the last year</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto px-6 pb-6">
          {activity.totalEvents ? (
            <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
              {calendar.map(({ isoDate, count }) => (
                <div
                  key={isoDate}
                  className={`h-3 w-3 rounded-sm ${activityColor(count)}`}
                  title={`${isoDate}: ${count} XP events`}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No XP activity has been recorded in the past year.
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className={`h-3 w-3 rounded-sm ${activityColor(level)}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </Card>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Monthly Activity</h2>
        {activity.months.length ? (
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Month</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">XP Events</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">XP Earned</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Active Days</th>
                </tr>
              </thead>
              <tbody>
                {activity.months.map((month) => (
                  <tr key={month.month} className="border-b last:border-0">
                    <td className="px-6 py-4 text-sm font-medium">
                      {new Date(`${month.month}-01T00:00:00`).toLocaleDateString("en", { month: "long", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-sm">{month.count}</td>
                    <td className="px-6 py-4 text-sm">{month.xp.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm"><Badge variant="secondary">{month.activeDays}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No monthly activity is available.
          </p>
        )}
      </section>
    </div>
  );
}