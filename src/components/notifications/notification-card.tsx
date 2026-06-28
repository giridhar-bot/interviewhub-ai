import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/dates";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
  link?: string;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onClick?: (id: string) => void;
  className?: string;
}

export function NotificationCard({ notification, onClick, className }: NotificationCardProps) {
  return (
    <button
      onClick={() => onClick?.(notification.id)}
      className={cn(
        "w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-900",
        !notification.isRead && "bg-violet-50/50 dark:bg-violet-950/10",
        className
      )}
    >
      <div className="flex items-start gap-2">
        {!notification.isRead && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-600" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.title}
          </p>
          <p className="text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
            {notification.message}
          </p>
          <p className="mt-1 text-[10px] text-gray-400">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </div>
      </div>
    </button>
  );
}
