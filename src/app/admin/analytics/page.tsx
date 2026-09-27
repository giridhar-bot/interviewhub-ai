import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";
import { analyticsRepository } from "@/repositories/analytics.repository";

export const metadata = generateSEO({
  title: "Analytics Dashboard — Admin",
  description: "View recorded platform traffic, sessions, and content counts.",
  path: "/admin/analytics",
  noIndex: true,
});

export const dynamic = "force-dynamic";

function formatDuration(seconds: number) {
  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;
  return minutes ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

export default async function AdminAnalyticsPage() {
  const analytics = await analyticsRepository.getAdminOverview(30);
  const metrics = [
    { label: "Page Views (30 days)", value: analytics.pageViews.toLocaleString() },
    { label: "Sessions (30 days)", value: analytics.sessions.toLocaleString() },
    { label: "Avg Session Duration", value: formatDuration(analytics.averageDurationSeconds) },
    { label: "Bounce Rate", value: `${analytics.bounceRate.toFixed(1)}%` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Recorded platform activity for the last 30 days</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl">{metric.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold">Top Pages</h2>
          {analytics.topPages.length ? (
            <div className="mt-4 overflow-hidden rounded-xl border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Page</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topPages.map((page) => (
                    <tr key={page.path} className="border-b last:border-0">
                      <td className="px-4 py-2 text-sm font-medium">{page.path}</td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">{page.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No page views have been recorded in this period.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold">Content Performance</h2>
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Published</th>
                </tr>
              </thead>
              <tbody>
                {analytics.content.map((item) => (
                  <tr key={item.type} className="border-b last:border-0">
                    <td className="px-4 py-2 text-sm font-medium">{item.type}</td>
                    <td className="px-4 py-2 text-sm">{item.total.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">{item.published.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}