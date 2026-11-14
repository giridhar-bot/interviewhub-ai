import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SettingsForm } from "@/features/auth/settings-form";
import { requireAuth } from "@/lib/auth-guard";
import { userRepository } from "@/repositories/user.repository";
import { generateSEO } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = generateSEO({
  title: "Settings",
  description: "Manage your account settings and preferences.",
  path: "/settings",
  noIndex: true,
});

export default async function SettingsPage() {
  const user = await requireAuth();
  const profile = await userRepository.getSettings(user.id);
  if (!profile) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your account settings and preferences</p>
      <Separator className="my-6" />
      <SettingsForm
        profile={{
          displayName: profile.displayName ?? profile.name ?? "",
          email: profile.email,
          bio: profile.bio ?? "",
          timezone: profile.timezone ?? "UTC",
        }}
      />
    </div>
  );
}
