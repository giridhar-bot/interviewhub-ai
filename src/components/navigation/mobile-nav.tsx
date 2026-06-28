"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUIStore } from "@/stores/ui.store";
import { mainNavItems } from "@/config/navigation";

export function MobileNav() {
  const { mobileMenuOpen, closeMobileMenu } = useUIStore();
  const pathname = usePathname();

  if (!mobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={closeMobileMenu} />
      <nav className="fixed inset-y-0 left-0 w-72 bg-white p-6 shadow-xl dark:bg-gray-950">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            InterviewHub AI
          </span>
          <button onClick={closeMobileMenu} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900"
                )}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
