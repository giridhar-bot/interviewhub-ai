import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";
import { adminRepository } from "@/repositories/admin.repository";

export const metadata = generateSEO({
  title: "System Settings — Admin",
  description: "View persisted platform settings and feature flags.",
  path: "/admin/settings",
  noIndex: true,
});

export const dynamic = "force-dynamic";

function formatLabel(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

export default async function AdminSettingsPage() {
  const [settings, featureFlags] = await Promise.all([
    adminRepository.getSettings(),
    adminRepository.getFeatureFlags(),
  ]);

  const settingsByCategory = new Map<string, typeof settings>();
  for (const setting of settings) {
    const category = setting.category ?? "Uncategorized";
    const categorySettings = settingsByCategory.get(category) ?? [];
    categorySettings.push(setting);
    settingsByCategory.set(category, categorySettings);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="mt-1 text-muted-foreground">Persisted platform settings and feature flags</p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-8">
        {Array.from(settingsByCategory.entries()).map(([category, categorySettings]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{formatLabel(category)}</CardTitle>
            </CardHeader>
            <div className="space-y-4 px-6 pb-6">
              {categorySettings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                  <span className="text-sm font-medium">{formatLabel(setting.key)}</span>
                  <span className="break-all text-right text-sm text-muted-foreground">
                    {JSON.stringify(setting.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {!settings.length && (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No system settings are stored.
          </p>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Feature Flags</h2>
        {featureFlags.length ? (
          <Card className="mt-4">
            <div className="space-y-3 p-6">
              {featureFlags.map((flag) => (
                <div key={flag.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">{formatLabel(flag.name)}</div>
                    {flag.description && <CardDescription className="text-xs">{flag.description}</CardDescription>}
                  </div>
                  <Badge className={flag.enabled ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}>
                    {flag.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No feature flags are stored.
          </p>
        )}
      </section>
    </div>
  );
}