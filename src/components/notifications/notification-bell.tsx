"use client";

import { cn } from "@/lib/utils";
import { BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BellSolid } from "@heroicons/react/24/solid";

interface NotificationBellProps {
  count: number;
  onClick: () => void;
  className?: string;
}

export function NotificationBell({ count, onClick, className }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={cn("relative rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800", className)}
      aria-label={`Notifications (${count} unread)`}
    >
      {count > 0 ? (
        <BellSolid className="h-5 w-5 text-violet-600" />
      ) : (
        <BellIcon className="h-5 w-5 text-gray-500" />
      )}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
