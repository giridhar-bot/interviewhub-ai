// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Date Utilities
// ══════════════════════════════════════════════════════════════

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return formatDate(date);
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function daysBetween(start: Date | string, end: Date | string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.floor(ms / 86_400_000);
}
