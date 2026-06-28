import { cn } from "@/lib/utils";
import Link from "next/link";

interface StatItem {
  label: string;
  value: number | string;
  href?: string;
}

interface LearningStatsProps {
  stats: StatItem[];
  className?: string;
}

export function LearningStats({ stats, className }: LearningStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {stats.map((stat) => {
        const content = (
          <div className="rounded-lg border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-950">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
          </div>
        );
        return stat.href ? (
          <Link key={stat.label} href={stat.href} className="transition-transform hover:scale-105">
            {content}
          </Link>
        ) : (
          <div key={stat.label}>{content}</div>
        );
      })}
    </div>
  );
}
