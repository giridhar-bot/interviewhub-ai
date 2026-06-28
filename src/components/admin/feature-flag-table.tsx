"use client";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface FeatureFlag {
  id: string;
  key: string;
  description?: string;
  enabled: boolean;
}

interface FeatureFlagTableProps {
  flags: FeatureFlag[];
  onToggle: (id: string, enabled: boolean) => void;
  className?: string;
}

export function FeatureFlagTable({ flags, onToggle, className }: FeatureFlagTableProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {flags.map((flag) => (
        <div
          key={flag.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950"
        >
          <div>
            <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
              {flag.key}
            </p>
            {flag.description && (
              <p className="text-xs text-gray-500">{flag.description}</p>
            )}
          </div>
          <Switch
            checked={flag.enabled}
            onCheckedChange={(enabled) => onToggle(flag.id, enabled)}
          />
        </div>
      ))}
    </div>
  );
}
