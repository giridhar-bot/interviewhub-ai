import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  BookmarkIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized interview preparation dashboard.",
  robots: { index: false, follow: false },
};

const streakDays = [true, true, true, false, true, true, true];
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

const recentActivity = [
  { type: "Completed", item: "React Hooks — Notes", time: "2h ago", icon: CheckCircleIcon },
  { type: "Practiced", item: "Two Sum — Easy", time: "3h ago", icon: ArrowTrendingUpIcon },
  { type: "Bookmarked", item: "System Design — URL Shortener", time: "5h ago", icon: BookmarkIcon },
  { type: "AI Tutor", item: "Asked about Java Streams", time: "1d ago", icon: SparklesIcon },
];

const continueLearning = [
  { topic: "Spring Boot", progress: 45, chapter: "Chapter 5: REST APIs" },
  { topic: "React", progress: 72, chapter: "Chapter 8: Custom Hooks" },
  { topic: "AWS", progress: 20, chapter: "Chapter 2: EC2 & VPC" },
];

const aiSuggestions = [
  "Practice more Medium-level DSA problems",
  "Review System Design concepts — HLD",
  "Complete your Spring Boot roadmap",
  "Try an AI Mock Interview for React role",
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Welcome back! 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your preparation overview
        </p>
      </div>

      {/* Top Widgets Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Daily Goal */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Daily Goal
              </CardDescription>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2">
              <CardTitle className="text-3xl font-extrabold">2/5</CardTitle>
              <span className="mb-1 text-sm text-muted-foreground">topics</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[40%] rounded-full bg-brand-gradient" />
            </div>
          </CardHeader>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Current Streak
              </CardDescription>
              <FireIcon className="h-4 w-4 text-orange-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold">
              6 <span className="text-base font-normal text-muted-foreground">days</span>
            </CardTitle>
            <div className="mt-2 flex gap-1.5">
              {streakDays.map((active, i) => (
                <div
                  key={i}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {dayLabels[i]}
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* XP */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Total XP
              </CardDescription>
              <TrophyIcon className="h-4 w-4 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold">2,450</CardTitle>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Level 12
              </Badge>
              <span className="text-xs text-muted-foreground">
                550 XP to Level 13
              </span>
            </div>
          </CardHeader>
        </Card>

        {/* Problems Solved */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium uppercase tracking-wider">
                Problems Solved
              </CardDescription>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-extrabold">87</CardTitle>
            <div className="mt-2 flex gap-3 text-xs">
              <span className="text-green-600">42 Easy</span>
              <span className="text-yellow-600">35 Medium</span>
              <span className="text-red-600">10 Hard</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left: Continue Learning + Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Continue Learning</CardTitle>
                <Link href="/topics">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <div className="px-6 pb-6 space-y-4">
              {continueLearning.map((item) => (
                <div
                  key={item.topic}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{item.topic}</p>
                      <span className="text-sm font-medium text-primary">
                        {item.progress}%
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {item.chapter}
                    </p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brand-gradient transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type} · {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: AI Suggestions + Bookmarks */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI Suggestions</CardTitle>
              </div>
            </CardHeader>
            <div className="px-6 pb-6 space-y-3">
              {aiSuggestions.map((suggestion, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-dashed p-3"
                >
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-sm text-muted-foreground">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <div className="px-6 pb-6 grid grid-cols-2 gap-2">
              <Link href="/ai-tools/tutor">
                <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                  <SparklesIcon className="h-5 w-5 text-violet-500" />
                  <span className="text-xs">AI Tutor</span>
                </Button>
              </Link>
              <Link href="/ai-tools/mock-interview">
                <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                  <BookOpenIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-xs">Mock Interview</span>
                </Button>
              </Link>
              <Link href="/coding">
                <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  <span className="text-xs">Practice DSA</span>
                </Button>
              </Link>
              <Link href="/ai-tools/resume-review">
                <Button variant="outline" className="w-full h-auto py-3 flex-col gap-1">
                  <BookmarkIcon className="h-5 w-5 text-orange-500" />
                  <span className="text-xs">Resume Review</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
