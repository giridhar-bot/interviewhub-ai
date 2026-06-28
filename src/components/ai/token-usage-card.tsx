import { cn } from "@/lib/utils";

interface TokenUsageCardProps {
  used: number;
  limit: number;
  plan: string;
  className?: string;
}

export function TokenUsageCard({ used, limit, plan, className }: TokenUsageCardProps) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">AI Usage</h3>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
          {plan}
        </span>
      </div>
      <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
        {used.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ {limit.toLocaleString()} tokens</span>
      </p>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={cn(
            "h-2 rounded-full transition-all",
            pct > 90 ? "bg-red-500" : pct > 70 ? "bg-yellow-500" : "bg-violet-600"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
