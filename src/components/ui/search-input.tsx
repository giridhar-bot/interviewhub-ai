"use client";

import { forwardRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={ref}
          type="search"
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white",
            className
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSearch) {
              onSearch((e.target as HTMLInputElement).value);
            }
          }}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
