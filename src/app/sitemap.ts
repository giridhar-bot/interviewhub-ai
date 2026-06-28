import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";

// Force dynamic rendering — sitemap queries DB at runtime
export const dynamic = "force-dynamic";

// Main sitemap index pointing to individual sitemaps
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/topics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/companies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/coding`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/interview`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/system-design`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/ai-tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic: Topics
  const topics = await prisma.topic.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const topicPages: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${siteConfig.url}/topics/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic: Articles
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/articles/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic: Companies
  const companies = await prisma.company.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const companyPages: MetadataRoute.Sitemap = companies.map((company) => ({
    url: `${siteConfig.url}/companies/${company.slug}`,
    lastModified: company.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic: Roadmaps
  const roadmaps = await prisma.roadmap.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const roadmapPages: MetadataRoute.Sitemap = roadmaps.map((roadmap) => ({
    url: `${siteConfig.url}/roadmaps/${roadmap.slug}`,
    lastModified: roadmap.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic: Coding Problems
  const problems = await prisma.codingProblem.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const problemPages: MetadataRoute.Sitemap = problems.map((problem) => ({
    url: `${siteConfig.url}/coding/${problem.slug}`,
    lastModified: problem.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Dynamic: CheatSheets
  const cheatSheets = await prisma.cheatSheet.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true, updatedAt: true },
  });

  const cheatSheetPages: MetadataRoute.Sitemap = cheatSheets.map((cs) => ({
    url: `${siteConfig.url}/cheatsheets/${cs.slug}`,
    lastModified: cs.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...topicPages,
    ...articlePages,
    ...companyPages,
    ...roadmapPages,
    ...problemPages,
    ...cheatSheetPages,
  ];
}
