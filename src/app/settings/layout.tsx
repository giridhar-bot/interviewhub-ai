import { requireAuth } from "@/lib/auth-guard";
import type { ReactNode } from "react";

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  await requireAuth();
  return <>{children}</>;
}
