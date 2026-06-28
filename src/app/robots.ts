import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin",
          "/auth/",
          "/api/",
          "/dashboard/",
          "/settings/",
          "/profile/",
          "/onboarding/",
          "/_next/",
          "/drafts/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/auth/",
          "/api/",
          "/dashboard/",
          "/settings/",
          "/onboarding/",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
