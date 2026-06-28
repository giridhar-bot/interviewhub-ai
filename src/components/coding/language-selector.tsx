"use client";

import { cn } from "@/lib/utils";

interface Language {
  value: string;
  label: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LanguageSelector({ languages, selected, onChange, className }: LanguageSelectorProps) {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-violet-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white",
        className
      )}
    >
      {languages.map((lang) => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  );
}
