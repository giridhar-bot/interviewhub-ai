import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/dates";

interface Version {
  id: string;
  version: number;
  createdAt: Date | string;
  changes?: string;
}

interface VersionHistoryProps {
  versions: Version[];
  currentId?: string;
  onRestore?: (id: string) => void;
  className?: string;
}

export function VersionHistory({ versions, currentId, onRestore, className }: VersionHistoryProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Version History</h3>
      <ul className="space-y-1">
        {versions.map((v) => (
          <li
            key={v.id}
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-2 text-sm",
              v.id === currentId
                ? "bg-violet-50 dark:bg-violet-950/20"
                : "hover:bg-gray-50 dark:hover:bg-gray-900"
            )}
          >
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                v{v.version}
              </span>
              <span className="ml-2 text-xs text-gray-400">
                {formatRelativeTime(v.createdAt)}
              </span>
            </div>
            {v.id !== currentId && onRestore && (
              <button
                onClick={() => onRestore(v.id)}
                className="text-xs text-violet-600 hover:underline"
              >
                Restore
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
