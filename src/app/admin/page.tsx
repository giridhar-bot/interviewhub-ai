import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";
import { analyticsRepository } from "@/repositories/analytics.repository";
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
  },
  {
    title: "User Management",
    description: "View and manage user accounts, roles, and subscriptions",
    icon: UsersIcon,
    href: "/admin/users",
  },
  {
    title: "Analytics",
    description: "Traffic, engagement, conversion rates, and revenue metrics",
    icon: ChartBarIcon,
    href: "/admin/analytics",
  },
  {
    title: "SEO Management",
    description: "Manage meta tags, sitemaps, structured data, and search rankings",
    icon: MagnifyingGlassIcon,
    href: "/admin/seo",
  },
  {
    title: "Moderation",
    description: "Review reported content, comments, and user submissions",
    icon: ShieldCheckIcon,
    href: "/admin/moderation",
  },
  {
    title: "Settings",
    description: "Platform configuration, feature flags, and integrations",
    icon: CogIcon,
    href: "/admin/settings",
  },
];

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await analyticsRepository.getDashboardStats();

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
          { label: "Total Users", value: stats.users },
          { label: "Published Articles", value: stats.articles },
          { label: "Published Problems", value: stats.problems },
          { label: "Published Posts", value: stats.posts },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs uppercase tracking-wider">
                {stat.label}
              </CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-2xl">{stat.value.toLocaleString()}</CardTitle>
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
