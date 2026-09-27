import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { requireAuth } from "@/lib/auth-guard";
import { getDashboardStats, getUserAchievementProgress } from "@/services/progress.service";
import { getUserAchievements } from "@/services/gamification.service";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const user = await requireAuth();
  const [dashboard, achievementProgress, achievements] = await Promise.all([
    getDashboardStats(user.id),
    getUserAchievementProgress(user.id),
    getUserAchievements(user.id),
  ]);
  const dailyGoal = dashboard.dailyGoal;
  const weeklyGoal = dashboard.weeklyGoal;

  const dailyTargets = [
    { name: "Earn XP", progress: dailyGoal.earnedXP, target: dailyGoal.targetXP, unit: "XP" },
    { name: "Read articles", progress: dailyGoal.articlesRead, target: dailyGoal.articlesGoal, unit: "articles" },
    { name: "Solve problems", progress: dailyGoal.problemsSolved, target: dailyGoal.problemsGoal, unit: "problems" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Goals & Challenges</h1>
      <p className="mt-1 text-muted-foreground">Progress saved to your account.</p>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Today&apos;s Goals</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {dailyTargets.map((goal) => {
            const percent = goal.target > 0 ? Math.min(100, (goal.progress / goal.target) * 100) : 0;
            return (
              <Card key={goal.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{goal.name}</CardTitle>
                    <span className="text-sm font-medium">{goal.progress}/{goal.target} {goal.unit}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-bold">Weekly Goal</h2>
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Earn XP</CardTitle>
              <span className="text-sm font-medium">{weeklyGoal.earnedXP}/{weeklyGoal.targetXP} XP</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${weeklyGoal.targetXP > 0 ? Math.min(100, (weeklyGoal.earnedXP / weeklyGoal.targetXP) * 100) : 0}%` }}
              />
            </div>
            <CardDescription className="mt-2">
              Topics studied: {weeklyGoal.topicsStudied}/{weeklyGoal.topicsGoal}
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <Separator className="my-8" />

      <section>
        <h2 className="text-lg font-bold">Achievement Progress</h2>
        {achievementProgress.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievementProgress.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm">{achievement.achievement}</CardTitle>
                    <Badge variant={achievement.completed ? "default" : "outline"}>
                      {achievement.completed ? "Complete" : `${Math.round(achievement.progress)}%`}
                    </Badge>
                  </div>
                  {!achievement.completed && (
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, achievement.progress)}%` }} />
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : achievements.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map(({ achievement, earnedAt }) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm">{achievement.name}</CardTitle>
                    <Badge>Earned</Badge>
                  </div>
                  <CardDescription>{earnedAt.toLocaleDateString("en", { dateStyle: "medium" })}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No achievement progress has been recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}