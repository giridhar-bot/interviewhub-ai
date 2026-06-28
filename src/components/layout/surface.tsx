import { cn } from "@/lib/utils";

interface SurfaceProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "inset";
}

export function Surface({ children, className, variant = "default" }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-lg",
        {
          default: "border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
          elevated: "bg-white shadow-lg dark:bg-gray-950",
          inset: "bg-gray-50 dark:bg-gray-900",
        }[variant],
        className
      )}
    >
      {children}
    </div>
  );
}
