import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/json-ld";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(items)),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <HomeIcon className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>
        {items.slice(1).map((item, index) => {
          const isLast = index === items.length - 2;
          return (
            <span key={item.href} className="flex items-center gap-1.5">
              <ChevronRightIcon className="h-3 w-3" />
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
