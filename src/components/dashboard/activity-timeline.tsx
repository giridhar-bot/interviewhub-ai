import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/dates";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  timestamp: Date | string;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-violet-600" />
            <div className="w-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-gray-500">{formatRelativeTime(item.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
