import { cn } from "@/lib/utils";
import Link from "next/link";

interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
}

interface ResumeTemplatesProps {
  templates: ResumeTemplate[];
  selected?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function ResumeTemplates({ templates, selected, onSelect, className }: ResumeTemplatesProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect?.(t.id)}
          className={cn(
            "group rounded-lg border-2 p-2 transition-all",
            selected === t.id
              ? "border-violet-500 shadow-md"
              : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
          )}
        >
          <div className="aspect-[3/4] overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <img
              src={t.thumbnail}
              alt={t.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <p className="mt-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.name}
          </p>
        </button>
      ))}
    </div>
  );
}
