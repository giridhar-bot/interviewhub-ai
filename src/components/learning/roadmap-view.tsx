import { cn } from "@/lib/utils";

interface RoadmapStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current?: boolean;
}

interface RoadmapViewProps {
  title: string;
  steps: RoadmapStep[];
  className?: string;
}

export function RoadmapView({ title, steps, className }: RoadmapViewProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  step.completed
                    ? "bg-green-500 text-white"
                    : step.current
                      ? "bg-violet-600 text-white"
                      : "bg-gray-200 text-gray-500 dark:bg-gray-800"
                )}
              >
                {step.completed ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[2rem]",
                    step.completed ? "bg-green-500" : "bg-gray-200 dark:bg-gray-800"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <h3 className={cn(
                "font-medium",
                step.current ? "text-violet-600" : "text-gray-900 dark:text-white"
              )}>
                {step.title}
              </h3>
              {step.description && (
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
