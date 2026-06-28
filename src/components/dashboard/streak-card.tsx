import { cn } from "@/lib/utils";
import { FireIcon } from "@heroicons/react/24/solid";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export function StreakCard({ currentStreak, longestStreak, className }: StreakCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <FireIcon className="h-5 w-5 text-orange-500" />
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Streak</h3>
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {currentStreak} <span className="text-sm font-normal text-gray-500">days</span>
      </p>
      <p className="mt-1 text-xs text-gray-500">Best: {longestStreak} days</p>
    </div>
  );
}
