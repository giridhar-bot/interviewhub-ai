import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { TrophyIcon, FireIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Leaderboard — Top Learners",
  description:
    "See the top learners on InterviewHub AI. Earn XP by completing notes, quizzes, coding problems, and maintaining streaks.",
  path: "/learn/leaderboard",
  keywords: ["leaderboard", "top learners", "XP ranking", "coding leaderboard"],
});

async function getLeaderboard() {
  return prisma.user.findMany({
    where: { deletedAt: null, bannedAt: null, xp: { gt: 0 } },
    orderBy: { xp: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      displayName: true,
      username: true,
      image: true,
      xp: true,
      streak: true,
    },
  });
}

function getLevel(xp: number): { level: number; title: string } {
  if (xp >= 10000) return { level: 10, title: "Legend" };
  if (xp >= 7500) return { level: 9, title: "Master" };
  if (xp >= 5000) return { level: 8, title: "Expert" };
  if (xp >= 3500) return { level: 7, title: "Advanced" };
  if (xp >= 2500) return { level: 6, title: "Proficient" };
  if (xp >= 1500) return { level: 5, title: "Intermediate" };
  if (xp >= 1000) return { level: 4, title: "Skilled" };
  if (xp >= 500) return { level: 3, title: "Apprentice" };
  if (xp >= 200) return { level: 2, title: "Beginner" };
  return { level: 1, title: "Newcomer" };
}

export default async function LeaderboardPage() {
  const users = await getLeaderboard();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Leaderboard", href: "/learn/leaderboard" },
          ])),
        }}
      />

      <div className="mb-10 text-center">
        <TrophyIcon className="mx-auto h-10 w-10 text-yellow-500" />
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-2 text-muted-foreground">
          Top learners ranked by XP. Study, practice, and climb!
        </p>
      </div>

      {users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user, index) => {
            const { level, title } = getLevel(user.xp);
            const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];
            return (
              <Card
                key={user.id}
                className={`flex items-center gap-4 p-4 ${index < 3 ? "border-primary/30" : ""}`}
              >
                {/* Rank */}
                <div className={`w-8 text-center text-lg font-bold ${rankColors[index] || "text-muted-foreground"}`}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                  {(user.displayName || user.name || "?").charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">
                    {user.displayName || user.name || user.username || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      Lv.{level} {title}
                    </Badge>
                    {user.streak > 0 && (
                      <span className="flex items-center gap-0.5">
                        <FireIcon className="h-3.5 w-3.5 text-orange-500" />
                        {user.streak}d
                      </span>
                    )}
                  </div>
                </div>

                {/* XP */}
                <div className="text-right">
                  <div className="font-bold">{user.xp.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No learners on the board yet. Start learning to be first!</p>
        </div>
      )}
    </div>
  );
}
