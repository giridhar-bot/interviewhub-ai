import { cn } from "@/lib/utils";
import { XMarkIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

interface AnnouncementBannerProps {
  message: string;
  link?: string;
  onDismiss?: () => void;
  className?: string;
}

export function AnnouncementBanner({ message, link, onDismiss, className }: AnnouncementBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 bg-violet-600 px-4 py-2 text-sm text-white",
        className
      )}
    >
      <MegaphoneIcon className="h-4 w-4 shrink-0" />
      {link ? (
        <a href={link} className="underline hover:no-underline">
          {message}
        </a>
      ) : (
        <span>{message}</span>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="ml-2 shrink-0 hover:opacity-80">
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
