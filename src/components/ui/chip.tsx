"use client";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: "default" | "outline";
  className?: string;
}

export function Chip({ label, onRemove, variant = "default", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          default: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
          outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
        }[variant],
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-violet-200 dark:hover:bg-violet-800"
        >
          ×
        </button>
      )}
    </span>
  );
}
