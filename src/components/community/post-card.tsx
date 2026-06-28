import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatRelativeTime } from "@/utils/dates";
import { ChatBubbleLeftIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

interface PostCardProps {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorAvatar?: string;
  excerpt?: string;
  votes: number;
  commentCount: number;
  tags: string[];
  createdAt: Date | string;
  className?: string;
}

export function PostCard({
  title,
  slug,
  author,
  excerpt,
  votes,
  commentCount,
  tags,
  createdAt,
  className,
}: PostCardProps) {
  return (
    <Link
      href={`/community/discussions/${slug}`}
      className={cn(
        "block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-violet-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <h3 className="font-semibold text-gray-900 hover:text-violet-600 dark:text-white">
        {title}
      </h3>
      {excerpt && (
        <p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">{excerpt}</p>
      )}
      <div className="mt-3 flex flex-wrap gap-1">
        {tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
        <span>{author}</span>
        <span>{formatRelativeTime(createdAt)}</span>
        <span className="flex items-center gap-1">
          <HandThumbUpIcon className="h-3.5 w-3.5" /> {votes}
        </span>
        <span className="flex items-center gap-1">
          <ChatBubbleLeftIcon className="h-3.5 w-3.5" /> {commentCount}
        </span>
      </div>
    </Link>
  );
}
