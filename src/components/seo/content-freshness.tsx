import { ClockIcon, UserIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface ContentFreshnessProps {
  updatedAt: string | Date;
  author?: string;
  version?: number;
  reviewedBy?: string;
}

export function ContentFreshness({ updatedAt, author, version, reviewedBy }: ContentFreshnessProps) {
  const date = new Date(updatedAt);
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t pt-4 mt-8">
      <span className="flex items-center gap-1.5">
        <ClockIcon className="h-4 w-4" />
        Last Updated: {formatted}
      </span>
      {author && (
        <span className="flex items-center gap-1.5">
          <UserIcon className="h-4 w-4" />
          Author: {author}
        </span>
      )}
      {version && (
        <span className="flex items-center gap-1.5">
          <ArrowPathIcon className="h-4 w-4" />
          Version {version}
        </span>
      )}
      {reviewedBy && (
        <span className="flex items-center gap-1.5">
          Reviewed by: {reviewedBy}
        </span>
      )}
    </div>
  );
}
