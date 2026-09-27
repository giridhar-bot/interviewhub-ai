import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FireIcon,
  TrophyIcon,
  BookOpenIcon,
  ClockIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { requireAuth } from "@/lib/auth-guard";
import { getUserCodingStats } from "@/services/coding.service";
import {
  getDashboardStats,
  getUserLearningProgress,
  getUserRecommendations,
} from "@/services/progress.service";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized interview preparation dashboard.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatLabel(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

export default async function DashboardPage() {
  const user = await requireAuth();
  const [dashboard, learning, coding, recommendations] = await Promise.all([
    getDashboardStats(user.id),
    getUserLearningProgress(user.id),
    getUserCodingStats(user.id),
    getUserRecommendations(user.id),
  ]);

  const goal = dashboard.dailyGoal;
  const goalPercent = goal.targetXP > 0 ? Math.min(100, (goal.earnedXP / goal.targetXP) * 100) : 0;
  const displayName = user.displayName ?? user.username ?? user.email;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {displayName}</h1>
        <p className="mt-1 text-muted-foreground">Your preparation progress from saved activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase">Daily XP Goal</CardDescription>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-extrabold">
              {goal.earnedXP}/{goal.targetXP}
              <span className="ml-2 text-base font-normal text-muted-foreground">XP</span>
            </CardTitle>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${goalPercent}%` }} />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase">Current Streak</CardDescription>
              <FireIcon className="h-4 w-4 text-orange-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold">{dashboard.streak} days</CardTitle>
            <p className="mt-2 text-xs text-muted-foreground">From your account activity</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase">Total XP</CardDescription>
              <TrophyIcon className="h-4 w-4 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold">{dashboard.totalXP.toLocaleString()}</CardTitle>
            <p className="mt-2 text-xs text-muted-foreground">{dashboard.badges} badges earned</p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase">Problems Solved</CardDescription>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-extrabold">{coding.problemsSolved}</CardTitle>
            <div className="mt-2 flex gap-3 text-xs">
              <span className="text-green-600">{coding.difficulty.easy} Easy</span>
              <span className="text-yellow-600">{coding.difficulty.medium} Medium</span>
              <span className="text-red-600">{coding.difficulty.hard} Hard</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Continue Learning</CardTitle>
                <Link href="/topics"><Button variant="ghost" size="sm">View All</Button></Link>
              </div>
            </CardHeader>
            <div className="space-y-4 px-6 pb-6">
              {learning.topicProgress.length ? learning.topicProgress.map((progress) => (
                <Link key={progress.topicId} href={`/topics/${progress.topic.slug}`} className="block rounded-lg border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{progress.topic.name}</p>
                    <span className="text-sm font-medium text-primary">{Math.round(progress.completion)}%</span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {progress.totalStudyMins} study minutes · {progress.articlesRead} articles · {progress.problemsSolved} problems
                  </p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, progress.completion)}%` }} />
                  </div>
                </Link>
              )) : (
                <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No topic progress recorded yet. Start with the learning hub.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
            <div className="space-y-3 px-6 pb-6">
              {dashboard.recentActivity.length ? dashboard.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 rounded-lg p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{formatLabel(activity.source)}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.amount > 0 ? `+${activity.amount} XP · ` : ""}
                      {activity.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                    </p>
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground">No activity recorded yet.</p>}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </div>
            </CardHeader>
            <div className="space-y-3 px-6 pb-6">
              {recommendations.length ? recommendations.map((recommendation) => (
                <div key={recommendation.id} className="rounded-lg border p-3">
                  <p className="text-sm font-medium">
                    {recommendation.topic?.name ?? formatLabel(recommendation.type)}
                  </p>
                  {recommendation.reason && <p className="mt-1 text-sm text-muted-foreground">{recommendation.reason}</p>}
                </div>
              )) : <p className="text-sm text-muted-foreground">No saved recommendations yet.</p>}
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <div className="grid grid-cols-2 gap-2 px-6 pb-6">
              <Link href="/ai-tools/tutor"><Button variant="outline" className="w-full">AI Tutor</Button></Link>
              <Link href="/ai-tools/mock-interview"><Button variant="outline" className="w-full">Mock Interview</Button></Link>
              <Link href="/coding"><Button variant="outline" className="w-full">Practice DSA</Button></Link>
              <Link href="/resume"><Button variant="outline" className="w-full">Resume</Button></Link>
            </div>
          </Card>
        </div>
      </div>
      <Separator className="mt-8" />
    </div>
  );
}