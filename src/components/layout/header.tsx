"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { mainNavItems } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Bars3Icon, SparklesIcon } from "@heroicons/react/24/outline";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccountActions } from "./account-actions";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-green-700">
            <SparklesIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight sm:text-xl">{siteConfig.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <ThemeToggle />
          <AccountActions />
        </div>

        {/* Mobile Menu */}
        <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="size-11" />}>
              <Bars3Icon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="overflow-y-auto p-6 data-[side=right]:w-full data-[side=right]:max-w-80"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 pt-8">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-green-700">
                    <SparklesIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">{siteConfig.name}</span>
                </Link>
                <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <div>{item.title}</div>
                      <div className="text-xs text-muted-foreground/70">{item.description}</div>
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 border-t pt-4">
                  <AccountActions mobile onNavigate={() => setOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
