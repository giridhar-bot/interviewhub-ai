import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";
import {
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin dashboard for managing InterviewHub AI content and users.",
  robots: { index: false, follow: false },
};

const adminModules = [
  {
    title: "Content Management",
    description: "Manage articles, questions, topics, roadmaps, and cheat sheets",
    icon: DocumentTextIcon,
    href: "/admin/content",
    count: "2,450 items",
  },
  {
    title: "User Management",
    description: "View and manage user accounts, roles, and subscriptions",
    icon: UsersIcon,
    href: "/admin/users",
    count: "12,340 users",
  },
  {
    title: "Analytics",
    description: "Traffic, engagement, conversion rates, and revenue metrics",
    icon: ChartBarIcon,
    href: "/admin/analytics",
    count: "Real-time",
  },
  {
    title: "SEO Management",
    description: "Manage meta tags, sitemaps, structured data, and search rankings",
    icon: MagnifyingGlassIcon,
    href: "/admin/seo",
    count: "1,200 pages",
  },
  {
    title: "Moderation",
    description: "Review reported content, comments, and user submissions",
    icon: ShieldCheckIcon,
    href: "/admin/moderation",
    count: "5 pending",
  },
  {
    title: "Settings",
    description: "Platform configuration, feature flags, and integrations",
    icon: CogIcon,
    href: "/admin/settings",
    count: "",
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-muted-foreground">
            Manage platform content, users, and analytics
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white">Admin</Badge>
      </div>

      <Separator className="my-6" />

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: "12,340", change: "+12%" },
          { label: "Active Today", value: "1,245", change: "+5%" },
          { label: "Premium Users", value: "890", change: "+18%" },
          { label: "Revenue (MTD)", value: "₹4.4L", change: "+22%" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wider">
                {stat.label}
              </CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
                <span className="text-xs font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Modules */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminModules.map((mod) => (
          <Link key={mod.title} href={mod.href}>
            <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <mod.icon className="h-5 w-5 text-primary" />
                  </div>
                  {mod.count && (
                    <Badge variant="secondary" className="text-xs">
                      {mod.count}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-3 text-base group-hover:text-primary">
                  {mod.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {mod.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
