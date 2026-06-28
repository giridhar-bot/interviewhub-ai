import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "EASY" | "MEDIUM" | "HARD";
  className?: string;
}

const styles = {
  EASY: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  HARD: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", styles[difficulty], className)}>
      {difficulty}
    </span>
  );
}
