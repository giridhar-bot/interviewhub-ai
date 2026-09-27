import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  LinkIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { analyticsRepository } from "@/repositories/analytics.repository";

export const metadata: Metadata = {
  title: "SEO Dashboard",
  description: "Monitor SEO health, sitemaps, meta tags, and content quality.",
  robots: { index: false, follow: false },
};

const seoModules = [
  {
    title: "Meta Tags Audit",
    description: "Review title, description, and OG tags for all pages",
    icon: MagnifyingGlassIcon,
    href: "/admin/seo/meta-audit",
  },
  {
    title: "Sitemap Status",
    description: "View generated sitemaps and submission status",
    icon: GlobeAltIcon,
    href: "/admin/seo/sitemaps",
  },
  {
    title: "Redirects Manager",
    description: "Manage 301/302 redirects and slug history",
    icon: ArrowPathIcon,
    href: "/admin/seo/redirects",
  },
  {
    title: "Structured Data",
    description: "Validate JSON-LD schema markup for all content types",
    icon: DocumentTextIcon,
    href: "/admin/seo/structured-data",
  },
  {
    title: "Internal Links",
    description: "Monitor auto-linking and cross-content connections",
    icon: LinkIcon,
    href: "/admin/seo/internal-links",
  },
  {
    title: "Content Quality",
    description: "Audit content for SEO best practices and freshness",
    icon: CheckCircleIcon,
    href: "/admin/seo/content-quality",
  },
];

export const dynamic = "force-dynamic";

export default async function SEODashboardPage() {
  const overview = await analyticsRepository.getAdminOverview(30);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">SEO Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor search engine optimization health and content quality
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Part 6: SEO Engine
        </Badge>
      </div>

      <Separator className="my-6" />

      {/* Content Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {overview.content.map((metric) => {
          const MetricIcon = metric.type === "Topics"
            ? GlobeAltIcon
            : metric.type === "Articles"
              ? DocumentTextIcon
              : ChartBarIcon;

          return (
          <Card key={metric.type}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <MetricIcon className="h-5 w-5 text-violet-600" />
              <div>
                <CardDescription>{metric.type}</CardDescription>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{metric.total.toLocaleString()}</CardTitle>
                  <Badge variant="secondary" className="text-xs">{metric.published.toLocaleString()} published</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
          );
        })}
      </div>

      {/* SEO Modules */}
      <h2 className="mt-10 text-xl font-bold">SEO Tools</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {seoModules.map((mod) => (
          <Card key={mod.title} className="cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950">
                  <mod.icon className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{mod.title}</CardTitle>
                  <CardDescription className="text-sm">{mod.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

    </div>
  );
}
