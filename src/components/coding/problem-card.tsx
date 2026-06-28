import { cn } from "@/lib/utils";
import Link from "next/link";
import { DifficultyBadge } from "@/components/quiz/difficulty-badge";

interface ProblemCardProps {
  title: string;
  slug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string[];
  acceptanceRate?: number;
  solved?: boolean;
  className?: string;
}

export function ProblemCard({
  title,
  slug,
  difficulty,
  tags,
  acceptanceRate,
  solved,
  className,
}: ProblemCardProps) {
  return (
    <Link
      href={`/coding/problems/${slug}`}
      className={cn(
        "flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all hover:border-violet-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:hover:border-violet-800",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {solved !== undefined && (
          <span className={cn("h-2.5 w-2.5 rounded-full", solved ? "bg-green-500" : "bg-gray-300")} />
        )}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
          <div className="mt-0.5 flex gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {acceptanceRate !== undefined && (
          <span className="text-xs text-gray-400">{acceptanceRate}%</span>
        )}
        <DifficultyBadge difficulty={difficulty} />
      </div>
    </Link>
  );
}
