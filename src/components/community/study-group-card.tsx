import { cn } from "@/lib/utils";
import Link from "next/link";

interface StudyGroupCardProps {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  topic: string;
  className?: string;
}

export function StudyGroupCard({
  id,
  name,
  description,
  memberCount,
  topic,
  className,
}: StudyGroupCardProps) {
  return (
    <Link
      href={`/community/groups`}
      className={cn(
        "block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
          {description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
        <span>{memberCount} members</span>
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
          {topic}
        </span>
      </div>
    </Link>
  );
}
