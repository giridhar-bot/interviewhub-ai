import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { InternalLink } from "@/lib/internal-links";

interface RelatedLinksProps {
  title?: string;
  links: InternalLink[];
}

const TYPE_COLORS: Record<string, string> = {
  topic: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  article: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  company: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  roadmap: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  cheatsheet: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  coding: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function RelatedLinks({ title = "Related Content", links }: RelatedLinksProps) {
  if (!links.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:border-violet-200 hover:shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium group-hover:text-violet-600">
                {link.title}
              </p>
            </div>
            <Badge variant="secondary" className={`shrink-0 text-xs ${TYPE_COLORS[link.type] || ""}`}>
              {link.type}
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
