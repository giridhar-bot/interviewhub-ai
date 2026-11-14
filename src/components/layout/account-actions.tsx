"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

export function AccountActions({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const refreshedPath = useRef<string | null>(null);
  useEffect(() => {
    if (refreshedPath.current === pathname) return;
    refreshedPath.current = pathname;
    void update();
  }, [pathname, update]);

  const buttonClass = mobile ? "h-11 w-full" : "h-9";
  return (
    <div className={mobile ? "flex flex-col gap-2" : "flex items-center gap-2"}>
      {status === "loading" ? (
        <span role="status" className="h-9 w-32 animate-pulse rounded-lg bg-muted">
          <span className="sr-only">Loading account</span>
        </span>
      ) : session?.user ? (
        <>
          <Link href="/dashboard" onClick={onNavigate}>
            <Button variant="outline" size="sm" className={buttonClass}>
              Dashboard
            </Button>
          </Link>
          {mobile && (
            <Link href="/settings" onClick={onNavigate}>
              <Button variant="ghost" className={buttonClass}>
                Settings
              </Button>
            </Link>
          )}
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm" className={buttonClass}>
              Log out
            </Button>
          </form>
        </>
      ) : (
        <>
          <Link href="/auth/login" onClick={onNavigate}>
            <Button variant={mobile ? "outline" : "ghost"} size="sm" className={buttonClass}>
              Log in
            </Button>
          </Link>
          <Link href="/auth/register" onClick={onNavigate}>
            <Button
              size="sm"
              className={`${buttonClass} bg-gradient-to-r from-emerald-600 to-green-600 text-white`}
            >
              Get Started Free
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
