import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your InterviewHub AI profile and statistics.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              GK
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">Girdhar Kumar</CardTitle>
              <Badge className="bg-brand-gradient text-white">Pro</Badge>
            </div>
            <CardDescription className="mt-1">
              Full Stack Developer · Member since Jun 2026
            </CardDescription>
            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
              <span>🔥 6 day streak</span>
              <span>⭐ 2,450 XP</span>
              <span>📝 87 problems solved</span>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardHeader>
      </Card>

      <Separator className="my-6" />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-green-600">42</CardTitle>
            <CardDescription>Easy Solved</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-yellow-600">35</CardTitle>
            <CardDescription>Medium Solved</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-red-600">10</CardTitle>
            <CardDescription>Hard Solved</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Activity Heatmap Placeholder */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Activity</CardTitle>
          <CardDescription>Your learning activity over the past year</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 52 * 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-sm ${
                  Math.random() > 0.6
                    ? Math.random() > 0.8
                      ? "bg-primary"
                      : "bg-primary/50"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
