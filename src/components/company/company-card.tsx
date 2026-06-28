import { cn } from "@/lib/utils";
import Link from "next/link";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

interface CompanyCardProps {
  name: string;
  slug: string;
  logo?: string;
  industry?: string;
  questionCount: number;
  experienceCount: number;
  isHiring?: boolean;
  className?: string;
}

export function CompanyCard({
  name,
  slug,
  logo,
  industry,
  questionCount,
  experienceCount,
  isHiring,
  className,
}: CompanyCardProps) {
  return (
    <Link
      href={`/companies/${slug}`}
      className={cn(
        "group rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-violet-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-violet-800",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {logo ? (
          <img src={logo} alt={name} className="h-10 w-10 rounded-md object-contain" />
        ) : (
          <BuildingOffice2Icon className="h-10 w-10 text-gray-400" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-violet-600 dark:text-white">
              {name}
            </h3>
            {isHiring && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Hiring
              </span>
            )}
          </div>
          {industry && <p className="text-sm text-gray-500">{industry}</p>}
          <div className="mt-2 flex gap-4 text-xs text-gray-400">
            <span>{questionCount} questions</span>
            <span>{experienceCount} experiences</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
