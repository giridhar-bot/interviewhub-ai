import { cn } from "@/lib/utils";
import Link from "next/link";

interface ContestBannerProps {
  title: string;
  slug: string;
  startsAt: Date | string;
  duration: number; // minutes
  participants?: number;
  className?: string;
}

export function ContestBanner({ title, slug, startsAt, duration, participants, className }: ContestBannerProps) {
  const start = new Date(startsAt);
  const isUpcoming = start > new Date();

  return (
    <Link
      href={`/coding/contests/${slug}`}
      className={cn(
        "block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white transition-transform hover:scale-[1.01]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-violet-200">
            {isUpcoming ? "Upcoming Contest" : "Live Contest"}
          </p>
          <h3 className="mt-1 text-xl font-bold">{title}</h3>
          <p className="mt-1 text-sm text-violet-200">
            {start.toLocaleDateString()} · {duration} min
          </p>
        </div>
        <div className="text-right">
          {participants !== undefined && (
            <p className="text-sm text-violet-200">{participants} participants</p>
          )}
        </div>
      </div>
    </Link>
  );
}
