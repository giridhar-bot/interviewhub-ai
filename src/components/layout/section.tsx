import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function Section({ children, className, title, description }: SectionProps) {
  return (
    <section className={cn("py-12 sm:py-16", className)}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
