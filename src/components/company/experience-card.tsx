import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/dates";

interface ExperienceCardProps {
  id: string;
  company: string;
  role: string;
  author: string;
  result: "SELECTED" | "REJECTED" | "PENDING";
  date: Date | string;
  slug: string;
  className?: string;
}

export function ExperienceCard({
  company,
  role,
  author,
  result,
  date,
  slug,
  className,
}: ExperienceCardProps) {
  const resultStyles = {
    SELECTED: "text-green-600 bg-green-50 dark:bg-green-950",
    REJECTED: "text-red-600 bg-red-50 dark:bg-red-950",
    PENDING: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950",
  };

  return (
    <Link
      href={`/companies/${slug}/experiences`}
      className={cn(
        "block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{role}</h3>
          <p className="text-sm text-gray-500">{company}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", resultStyles[result])}>
          {result}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <span>by {author}</span>
        <span>·</span>
        <span>{formatRelativeTime(date)}</span>
      </div>
    </Link>
  );
}
