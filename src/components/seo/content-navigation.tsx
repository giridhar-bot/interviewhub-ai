import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import type { InternalLink } from "@/lib/internal-links";

interface ContentNavigationProps {
  prev: InternalLink | null;
  next: InternalLink | null;
}

export function ContentNavigation({ prev, next }: ContentNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="Content navigation" className="mt-12 flex items-stretch gap-4">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-1 items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-violet-200 hover:shadow-md"
        >
          <ArrowLeftIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-violet-600" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="truncate font-medium group-hover:text-violet-600">{prev.title}</p>
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-1 items-center justify-end gap-3 rounded-xl border bg-card p-4 text-right transition-all hover:border-violet-200 hover:shadow-md"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="truncate font-medium group-hover:text-violet-600">{next.title}</p>
          </div>
          <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-violet-600" />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
