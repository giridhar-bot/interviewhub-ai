"use client";

import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <ExclamationTriangleIcon className="mb-4 h-12 w-12 text-red-400" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
