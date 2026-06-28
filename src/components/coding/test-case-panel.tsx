"use client";

import { cn } from "@/lib/utils";

interface TestCase {
  id: string;
  input: string;
  expected: string;
  actual?: string;
  passed?: boolean;
}

interface TestCasePanelProps {
  testCases: TestCase[];
  className?: string;
}

export function TestCasePanel({ testCases, className }: TestCasePanelProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Test Cases</h3>
      {testCases.map((tc, i) => (
        <div
          key={tc.id}
          className={cn(
            "rounded-md border p-3 text-xs font-mono",
            tc.passed === true
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
              : tc.passed === false
                ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                : "border-gray-200 dark:border-gray-800"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-gray-500">Case {i + 1}</span>
            {tc.passed !== undefined && (
              <span className={tc.passed ? "text-green-600" : "text-red-600"}>
                {tc.passed ? "Passed" : "Failed"}
              </span>
            )}
          </div>
          <div className="mt-2 space-y-1">
            <div><span className="text-gray-400">Input: </span>{tc.input}</div>
            <div><span className="text-gray-400">Expected: </span>{tc.expected}</div>
            {tc.actual !== undefined && (
              <div><span className="text-gray-400">Output: </span>{tc.actual}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
