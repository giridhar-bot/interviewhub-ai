"use client";

import { cn } from "@/lib/utils";
import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const alertStyles = {
  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
  success: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  error: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

const alertIcons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon,
};

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  const Icon = alertIcons[variant];

  return (
    <div className={cn("flex gap-3 rounded-lg border p-4", alertStyles[variant], className)} role="alert">
      <Icon className="h-5 w-5 shrink-0" />
      <div className="space-y-1">
        {title && <h4 className="text-sm font-semibold">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
