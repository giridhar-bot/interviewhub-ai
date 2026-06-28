import { cn } from "@/lib/utils";

interface SuggestedPrompt {
  label: string;
  prompt: string;
}

interface SuggestedPromptsProps {
  prompts: SuggestedPrompt[];
  onSelect: (prompt: string) => void;
  className?: string;
}

export function SuggestedPrompts({ prompts, onSelect, className }: SuggestedPromptsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {prompts.map((p) => (
        <button
          key={p.prompt}
          onClick={() => onSelect(p.prompt)}
          className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-violet-600"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
