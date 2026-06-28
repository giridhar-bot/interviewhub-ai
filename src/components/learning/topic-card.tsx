import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TopicCardProps {
  title: string;
  slug: string;
  description?: string;
  articleCount: number;
  icon?: React.ReactNode;
  difficulty?: string;
  className?: string;
}

export function TopicCard({ title, slug, description, articleCount, icon, difficulty, className }: TopicCardProps) {
  return (
    <Link
      href={`/topics/${slug}`}
      className={cn(
        "group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-violet-800",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="text-violet-600">{icon}</div>}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
              {description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">{articleCount} articles</span>
            {difficulty && <Badge variant="secondary">{difficulty}</Badge>}
          </div>
        </div>
      </div>
    </Link>
  );
}
