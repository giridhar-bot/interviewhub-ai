"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 dark:border-gray-700",
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
