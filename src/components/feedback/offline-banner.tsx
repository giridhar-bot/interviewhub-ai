"use client";

import { cn } from "@/lib/utils";
import { WifiIcon } from "@heroicons/react/24/outline";

interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className }: OfflineBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 bg-yellow-500 px-4 py-2 text-sm font-medium text-white",
        className
      )}
    >
      <WifiIcon className="h-4 w-4" />
      <span>You are offline. Some features may not be available.</span>
    </div>
  );
}
