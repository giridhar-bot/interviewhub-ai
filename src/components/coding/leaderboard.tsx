import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  score: number;
  solved: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  className?: string;
}

export function Leaderboard({ entries, className }: LeaderboardProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800", className)}>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-500">#</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">User</th>
            <th className="px-4 py-2 text-right font-medium text-gray-500">Score</th>
            <th className="px-4 py-2 text-right font-medium text-gray-500">Solved</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {entries.map((entry) => (
            <tr key={entry.rank} className="bg-white dark:bg-gray-950">
              <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">
                {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{entry.username}</td>
              <td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">
                {entry.score}
              </td>
              <td className="px-4 py-2 text-right text-gray-500">{entry.solved}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
