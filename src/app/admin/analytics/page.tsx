import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Analytics Dashboard — Admin",
  description: "View platform analytics, user metrics, and content performance.",
  path: "/admin/analytics",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const metrics = [
  { label: "Total Page Views", value: "1.2M", change: "+15%", period: "vs last month" },
  { label: "Unique Visitors", value: "285K", change: "+22%", period: "vs last month" },
  { label: "Avg Session Duration", value: "8m 24s", change: "+5%", period: "vs last month" },
  { label: "Bounce Rate", value: "32%", change: "-3%", period: "vs last month" },
];

const topPages = [
  { path: "/coding/problems/two-sum", views: 45000, unique: 32000 },
  { path: "/system-design/url-shortener", views: 38000, unique: 28000 },
  { path: "/learn/roadmaps/frontend", views: 32000, unique: 25000 },
  { path: "/companies/google", views: 28000, unique: 22000 },
  { path: "/dsa/patterns/dynamic-programming", views: 25000, unique: 20000 },
  { path: "/interview/behavioral", views: 22000, unique: 18000 },
  { path: "/resume/templates", views: 20000, unique: 16000 },
  { path: "/learn/notes/javascript-closures", views: 18000, unique: 14000 },
];

const contentMetrics = [
  { type: "Coding Problems", total: 500, active: 480, engagement: "85%" },
  { type: "Articles/Notes", total: 350, active: 320, engagement: "72%" },
  { type: "System Design", total: 45, active: 42, engagement: "90%" },
  { type: "Company Pages", total: 80, active: 75, engagement: "78%" },
  { type: "Quizzes", total: 200, active: 185, engagement: "65%" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Platform performance metrics and user engagement</p>

      {/* Key Metrics */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardHeader className="pb-2">
              <CardDescription>{m.label}</CardDescription>
              <CardTitle className="text-2xl">{m.value}</CardTitle>
              <div className="flex items-center gap-1 text-xs">
                <span className={m.change.startsWith("+") ? "text-green-600" : m.change.startsWith("-") && m.label === "Bounce Rate" ? "text-green-600" : "text-red-600"}>
                  {m.change}
                </span>
                <span className="text-muted-foreground">{m.period}</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Top Pages */}
        <div>
          <h2 className="text-xl font-bold">Top Pages</h2>
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Page</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Views</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Unique</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.path} className="border-b last:border-0">
                    <td className="px-4 py-2 text-sm font-medium">{p.path}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">{p.views.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">{p.unique.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Metrics */}
        <div>
          <h2 className="text-xl font-bold">Content Performance</h2>
          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Active</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {contentMetrics.map((c) => (
                  <tr key={c.type} className="border-b last:border-0">
                    <td className="px-4 py-2 text-sm font-medium">{c.type}</td>
                    <td className="px-4 py-2 text-sm">{c.total}</td>
                    <td className="px-4 py-2 text-sm">{c.active}</td>
                    <td className="px-4 py-2 text-sm font-medium text-green-600">{c.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Traffic Trends</h2>
        <Card className="mt-4">
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted-foreground">Chart visualization will render here</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
