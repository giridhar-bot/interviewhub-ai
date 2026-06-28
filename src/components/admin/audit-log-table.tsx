import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/dates";

interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target?: string;
  timestamp: Date | string;
  details?: string;
}

interface AuditLogTableProps {
  entries: AuditEntry[];
  className?: string;
}

export function AuditLogTable({ entries, className }: AuditLogTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800", className)}>
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Actor</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Target</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {entries.map((entry) => (
            <tr key={entry.id} className="bg-white dark:bg-gray-950">
              <td className="px-4 py-2">
                <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-800">
                  {entry.action}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{entry.actor}</td>
              <td className="px-4 py-2 text-gray-500">{entry.target || "—"}</td>
              <td className="px-4 py-2 text-gray-400">{formatRelativeTime(entry.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
