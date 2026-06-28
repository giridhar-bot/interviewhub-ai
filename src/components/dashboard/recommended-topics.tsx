import { cn } from "@/lib/utils";
import Link from "next/link";

interface RecommendedItem {
  id: string;
  title: string;
  type: string;
  href: string;
}

interface RecommendedTopicsProps {
  items: RecommendedItem[];
  className?: string;
}

export function RecommendedTopics({ items, className }: RecommendedTopicsProps) {
  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950", className)}>
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Recommended for You</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <span className="text-gray-700 dark:text-gray-300">{item.title}</span>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                {item.type}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
