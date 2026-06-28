"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = "ghost", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50",
          {
            default: "bg-violet-600 text-white hover:bg-violet-700",
            ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
            outline: "border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800",
          }[variant],
          {
            sm: "h-8 w-8",
            md: "h-9 w-9",
            lg: "h-10 w-10",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";
