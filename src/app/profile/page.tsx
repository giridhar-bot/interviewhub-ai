import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { requireAuth } from "@/lib/auth-guard";
import { getUserActivityCalendar } from "@/services/progress.service";
import { getUserCodingStats } from "@/services/coding.service";
import { userRepository } from "@/repositories/user.repository";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile",
  description: "Your InterviewHub AI profile and statistics.",
  robots: { index: false, follow: false },
};

function activityColor(count: number) {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-green-200";
  if (count <= 3) return "bg-green-400";
  if (count <= 6) return "bg-green-600";
  return "bg-green-800";
}

export default async function ProfilePage() {
  const sessionUser = await requireAuth();
  const [user, coding, activity] = await Promise.all([
    userRepository.getProfileById(sessionUser.id),
    getUserCodingStats(sessionUser.id),
    getUserActivityCalendar(sessionUser.id),
  ]);

  if (!user) return null;

  const name = user.displayName ?? user.name ?? user.username ?? sessionUser.email;
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar ?? user.image ?? undefined} alt={name} />
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl">{name}</CardTitle>
              <Badge variant="secondary">{user.plan}</Badge>
            </div>
            {user.bio && <CardDescription className="mt-1">{user.bio}</CardDescription>}
            <CardDescription className="mt-1">
              Member since {user.createdAt.toLocaleDateString("en", { month: "short", year: "numeric" })}
            </CardDescription>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{user.streak} day streak</span>
              <span>{user.xp.toLocaleString()} XP</span>
              <span>{coding.problemsSolved} problems solved</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Separator className="my-6" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardHeader className="text-center"><CardTitle className="text-3xl font-extrabold text-green-600">{coding.difficulty.easy}</CardTitle><CardDescription>Easy Solved</CardDescription></CardHeader></Card>
        <Card><CardHeader className="text-center"><CardTitle className="text-3xl font-extrabold text-yellow-600">{coding.difficulty.medium}</CardTitle><CardDescription>Medium Solved</CardDescription></CardHeader></Card>
        <Card><CardHeader className="text-center"><CardTitle className="text-3xl font-extrabold text-red-600">{coding.difficulty.hard}</CardTitle><CardDescription>Hard Solved</CardDescription></CardHeader></Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Activity</CardTitle>
          <CardDescription>{activity.totalEvents} XP events · {activity.activeDays} active days in the past year</CardDescription>
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
              No XP activity has been recorded yet.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}