import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Goals & Challenges — Set Your Targets",
  description: "Set daily, weekly, and monthly learning goals. Track your progress and stay accountable.",
  path: "/dashboard/goals",
  noIndex: true,
});

const dailyGoals = [
  { name: "Solve 5 problems", progress: 3, target: 5, unit: "problems" },
  { name: "Study 2 hours", progress: 1.5, target: 2, unit: "hours" },
  { name: "Review 20 flashcards", progress: 20, target: 20, unit: "cards" },
  { name: "Read 1 article", progress: 0, target: 1, unit: "articles" },
];

const weeklyGoals = [
  { name: "Complete 25 problems", progress: 18, target: 25 },
  { name: "Finish System Design module", progress: 3, target: 5 },
  { name: "Take 2 mock interviews", progress: 1, target: 2 },
  { name: "Earn 500 XP", progress: 380, target: 500 },
];

const monthlyMissions = [
  { name: "Complete DSA Phase 2", description: "Finish all Linked List, Stack, Queue, and Sliding Window problems", progress: 65, reward: "500 XP + Silver Badge" },
  { name: "System Design Beginner", description: "Complete 5 system design case studies", progress: 40, reward: "300 XP + Design Badge" },
  { name: "30-Day Streak", description: "Study every day for 30 consecutive days", progress: 73, reward: "1000 XP + Streak Master Badge" },
];

const achievements = [
  { name: "First Blood", description: "Solve your first problem", earned: true, date: "Dec 2024" },
  { name: "Week Warrior", description: "7-day study streak", earned: true, date: "Jan 2025" },
  { name: "Century", description: "Solve 100 problems", earned: false, progress: "87/100" },
  { name: "Design Thinker", description: "Complete 10 system designs", earned: false, progress: "4/10" },
  { name: "Community Hero", description: "Get 50 upvotes on your posts", earned: false, progress: "23/50" },
  { name: "Quiz Master", description: "Score 90%+ on 10 quizzes", earned: false, progress: "6/10" },
];

export default function GoalsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Goals &{" "}
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Challenges
        </span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Set targets, track progress, and earn rewards for your consistency.
      </p>

      {/* Daily Goals */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Today&apos;s Goals</h2>
          <Button variant="outline" size="sm">Edit Goals</Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {dailyGoals.map((g) => (
            <Card key={g.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{g.name}</CardTitle>
                  <span className="text-sm font-medium">
                    {g.progress}/{g.target}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${g.progress >= g.target ? "bg-green-500" : "bg-violet-500"}`}
                    style={{ width: `${Math.min(100, (g.progress / g.target) * 100)}%` }}
                  />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Weekly Goals */}
      <div>
        <h2 className="text-lg font-bold">Weekly Goals</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {weeklyGoals.map((g) => (
            <Card key={g.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{g.name}</CardTitle>
                  <span className="text-sm font-medium">
                    {g.progress}/{g.target}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${Math.min(100, (g.progress / g.target) * 100)}%` }}
                  />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Monthly Missions */}
      <div>
        <h2 className="text-lg font-bold">Monthly Missions</h2>
        <div className="mt-4 space-y-4">
          {monthlyMissions.map((m) => (
            <Card key={m.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{m.name}</CardTitle>
                    <CardDescription>{m.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{m.reward}</Badge>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{m.progress}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-bold">Achievements</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <Card key={a.name} className={a.earned ? "" : "opacity-60"}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${a.earned ? "bg-yellow-100 text-yellow-600" : "bg-muted text-muted-foreground"}`}>
                    {a.earned ? "🏆" : "🔒"}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{a.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {a.earned ? `Earned ${a.date}` : a.progress}
                    </CardDescription>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{a.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
