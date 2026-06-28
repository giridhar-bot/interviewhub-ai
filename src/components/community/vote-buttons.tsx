"use client";

import { cn } from "@/lib/utils";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as ThumbUpSolid,
  HandThumbDownIcon as ThumbDownSolid,
} from "@heroicons/react/24/solid";

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  onVote: (type: "up" | "down") => void;
  className?: string;
}

export function VoteButtons({ upvotes, downvotes, userVote, onVote, className }: VoteButtonsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => onVote("up")}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors",
          userVote === "up"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30"
            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        {userVote === "up" ? (
          <ThumbUpSolid className="h-4 w-4" />
        ) : (
          <HandThumbUpIcon className="h-4 w-4" />
        )}
        {upvotes}
      </button>
      <button
        onClick={() => onVote("down")}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors",
          userVote === "down"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30"
            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        {userVote === "down" ? (
          <ThumbDownSolid className="h-4 w-4" />
        ) : (
          <HandThumbDownIcon className="h-4 w-4" />
        )}
        {downvotes}
      </button>
    </div>
  );
}
