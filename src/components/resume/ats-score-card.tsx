import { cn } from "@/lib/utils";

interface ATSScoreCardProps {
  score: number;
  keywords: { keyword: string; found: boolean }[];
  className?: string;
}

export function ATSScoreCard({ score, keywords, className }: ATSScoreCardProps) {
  const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <h3 className="text-sm font-medium text-gray-500">ATS Score</h3>
      <p className={cn("mt-2 text-4xl font-bold", color)}>{score}%</p>
      <div className="mt-4 space-y-1.5">
        <h4 className="text-xs font-medium text-gray-500">Keywords</h4>
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw) => (
            <span
              key={kw.keyword}
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                kw.found
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              )}
            >
              {kw.keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
