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
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "SEO Dashboard",
  description: "Monitor SEO health, sitemaps, meta tags, and content quality.",
  robots: { index: false, follow: false },
};

const seoChecklist = [
  { label: "Sitemap generated", status: "pass", detail: "sitemap.xml auto-generated" },
  { label: "robots.txt configured", status: "pass", detail: "Proper allow/disallow rules" },
  { label: "Canonical URLs", status: "pass", detail: "All pages have canonical URLs" },
  { label: "OG images", status: "pass", detail: "Dynamic OG image API active" },
  { label: "JSON-LD structured data", status: "pass", detail: "Organization, Website, BreadcrumbList, Article, FAQPage, Course" },
  { label: "Meta descriptions", status: "warning", detail: "Check new pages for unique descriptions" },
  { label: "Internal linking", status: "pass", detail: "Auto-linking engine active" },
  { label: "Mobile-first design", status: "pass", detail: "Responsive layouts throughout" },
  { label: "Security headers", status: "pass", detail: "CSP, HSTS, X-Frame-Options configured" },
  { label: "HTTPS enforced", status: "pass", detail: "All traffic over HTTPS" },
];

const contentMetrics = [
  { label: "Topics", icon: GlobeAltIcon, count: "50+", status: "Published" },
  { label: "Articles", icon: DocumentTextIcon, count: "0", status: "Draft" },
  { label: "Companies", icon: ChartBarIcon, count: "12", status: "Seeded" },
  { label: "Redirects", icon: LinkIcon, count: "0", status: "Active" },
];

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

export default function SEODashboardPage() {
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contentMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <metric.icon className="h-5 w-5 text-violet-600" />
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{metric.count}</CardTitle>
                  <Badge variant="secondary" className="text-xs">{metric.status}</Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
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

      {/* Technical SEO Checklist */}
      <h2 className="mt-10 text-xl font-bold">Technical SEO Checklist</h2>
      <div className="mt-4 space-y-2">
        {seoChecklist.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-lg border bg-card p-3"
          >
            {item.status === "pass" ? (
              <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-600" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-amber-500" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
            <Badge
              variant="secondary"
              className={`text-xs ${
                item.status === "pass"
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {item.status === "pass" ? "Pass" : "Warning"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
