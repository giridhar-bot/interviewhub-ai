import { cn } from "@/lib/utils";

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: "1:1" | "1:2" | "2:1" | "1:3" | "3:1";
  className?: string;
}

export function SplitPane({ left, right, ratio = "1:1", className }: SplitPaneProps) {
  const gridCols = {
    "1:1": "lg:grid-cols-2",
    "1:2": "lg:grid-cols-[1fr_2fr]",
    "2:1": "lg:grid-cols-[2fr_1fr]",
    "1:3": "lg:grid-cols-[1fr_3fr]",
    "3:1": "lg:grid-cols-[3fr_1fr]",
  }[ratio];

  return (
    <div className={cn("grid grid-cols-1 gap-6", gridCols, className)}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
