import { cn } from "@/lib/utils";

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function Grid({ children, cols = 3, gap = "md", className }: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        {
          1: "grid-cols-1",
          2: "grid-cols-1 sm:grid-cols-2",
          3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        }[cols],
        {
          sm: "gap-3",
          md: "gap-6",
          lg: "gap-8",
        }[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

interface StackProps {
  children: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
  direction?: "vertical" | "horizontal";
  className?: string;
}

export function Stack({ children, gap = "md", direction = "vertical", className }: StackProps) {
  return (
    <div
      className={cn(
        direction === "vertical" ? "flex flex-col" : "flex flex-row items-center",
        {
          xs: "gap-1",
          sm: "gap-2",
          md: "gap-4",
          lg: "gap-6",
        }[gap],
        className
      )}
    >
      {children}
    </div>
  );
}
