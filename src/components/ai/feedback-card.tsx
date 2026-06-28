import { cn } from "@/lib/utils";
import { StarIcon } from "@heroicons/react/24/solid";

interface FeedbackCardProps {
  category: string;
  score: number;
  maxScore?: number;
  feedback: string;
  className?: string;
}

export function FeedbackCard({ category, score, maxScore = 10, feedback, className }: FeedbackCardProps) {
  const pct = (score / maxScore) * 100;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{category}</h3>
        <div className="flex items-center gap-1">
          <StarIcon className={cn("h-4 w-4", pct >= 70 ? "text-yellow-500" : "text-gray-300")} />
          <span className="text-sm font-bold text-gray-900 dark:text-white">{score}/{maxScore}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{feedback}</p>
    </div>
  );
}
