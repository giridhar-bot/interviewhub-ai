"use client";

import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-gray-700",
          {
            top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
            bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
            left: "right-full top-1/2 mr-2 -translate-y-1/2",
            right: "left-full top-1/2 ml-2 -translate-y-1/2",
          }[side],
          className
        )}
      >
        {content}
      </div>
    </div>
  );
}
