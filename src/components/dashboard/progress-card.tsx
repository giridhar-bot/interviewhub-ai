import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  value: number;
  total: number;
  icon?: React.ReactNode;
  className?: string;
}

export function ProgressCard({ title, value, total, icon, className }: ProgressCardProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {icon && <div className="text-violet-600">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value} <span className="text-sm font-normal text-gray-500">/ {total}</span>
      </p>
      <div className="mt-3 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">{pct}% complete</p>
    </div>
  );
}
