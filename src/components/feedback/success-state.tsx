import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface SuccessStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessState({
  title = "Success!",
  message,
  action,
  className,
}: SuccessStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <CheckCircleIcon className="mb-4 h-12 w-12 text-green-500" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {message && (
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
