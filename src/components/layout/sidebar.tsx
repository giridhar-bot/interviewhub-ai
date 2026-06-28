"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 bg-white transition-all dark:border-gray-800 dark:bg-gray-950",
        sidebarOpen ? "w-64" : "w-0 -translate-x-full lg:w-16 lg:translate-x-0",
        className
      )}
    >
      {children}
    </aside>
  );
}
