"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useUIStore } from "@/stores/ui.store";

interface CommandPaletteProps {
  onSearch?: (query: string) => void;
  className?: string;
}

export function CommandPalette({ onSearch, className }: CommandPaletteProps) {
  const { commandPaletteOpen, toggleCommandPalette } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      inputRef.current?.focus();
      setQuery("");
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        toggleCommandPalette();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen, toggleCommandPalette]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/50" onClick={toggleCommandPalette} />
      <div
        className={cn(
          "relative w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900",
          className
        )}
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-700">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && onSearch) onSearch(query);
            }}
            placeholder="Search topics, articles, problems..."
            className="flex-1 border-0 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 dark:text-white"
          />
          <kbd className="hidden rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 sm:inline dark:bg-gray-800">
            Esc
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          <p className="px-2 py-6 text-center text-sm text-gray-500">
            {query ? "No results found." : "Start typing to search..."}
          </p>
        </div>
      </div>
    </div>
  );
}
