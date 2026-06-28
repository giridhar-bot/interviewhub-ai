import { cn } from "@/lib/utils";
import Link from "next/link";

interface CheatSheetCardProps {
  title: string;
  slug: string;
  topic: string;
  itemCount: number;
  className?: string;
}

export function CheatSheetCard({ title, slug, topic, itemCount, className }: CheatSheetCardProps) {
  return (
    <Link
      href={`/learn/cheat-sheets/${slug}`}
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-violet-800",
        className
      )}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{topic}</p>
      <p className="mt-2 text-xs text-gray-400">{itemCount} items</p>
    </Link>
  );
}
