import { cn } from "@/lib/utils";

interface HealthMetric {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency?: number;
}

interface SystemHealthCardProps {
  metrics: HealthMetric[];
  className?: string;
}

export function SystemHealthCard({ metrics, className }: SystemHealthCardProps) {
  const statusStyles = {
    healthy: "bg-green-500",
    degraded: "bg-yellow-500",
    down: "bg-red-500",
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">System Health</h3>
      <div className="mt-3 space-y-2">
        {metrics.map((m) => (
          <div key={m.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", statusStyles[m.status])} />
              <span className="text-gray-700 dark:text-gray-300">{m.name}</span>
            </div>
            {m.latency !== undefined && (
              <span className="text-xs text-gray-400">{m.latency}ms</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
