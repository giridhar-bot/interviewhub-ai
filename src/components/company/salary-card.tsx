import { cn } from "@/lib/utils";

interface SalaryCardProps {
  role: string;
  company: string;
  minSalary: number;
  maxSalary: number;
  currency?: string;
  experience?: string;
  className?: string;
}

export function SalaryCard({
  role,
  company,
  minSalary,
  maxSalary,
  currency = "₹",
  experience,
  className,
}: SalaryCardProps) {
  function formatSalary(amount: number) {
    if (amount >= 10_000_000) return `${(amount / 10_000_000).toFixed(1)}Cr`;
    if (amount >= 100_000) return `${(amount / 100_000).toFixed(1)}L`;
    return amount.toLocaleString();
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950",
        className
      )}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">{role}</h3>
      <p className="text-sm text-gray-500">{company}</p>
      <p className="mt-2 text-lg font-bold text-green-600">
        {currency}{formatSalary(minSalary)} – {currency}{formatSalary(maxSalary)}
      </p>
      {experience && <p className="mt-1 text-xs text-gray-400">{experience}</p>}
    </div>
  );
}
