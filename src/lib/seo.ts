import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// ═══════════════════════════════════════════════
// BASE METADATA GENERATOR
// ═══════════════════════════════════════════════

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function generateSEO({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  keywords,
}: SEOProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || `${siteConfig.url}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    keywords: keywords || siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@interviewhubai",
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  };
}

// ═══════════════════════════════════════════════
// ARTICLE METADATA
// ═══════════════════════════════════════════════

interface ArticleSEOProps extends SEOProps {
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  authorName?: string;
  section?: string;
}

export function generateArticleSEO({
  title,
  description,
  path,
  image,
  publishedTime,
  modifiedTime,
  tags,
  authorName,
  section,
  keywords,
}: ArticleSEOProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || `${siteConfig.url}/api/og?title=${encodeURIComponent(title)}&type=article`;

  return {
    title,
    description,
    keywords: keywords || tags,
    authors: authorName ? [{ name: authorName }] : [{ name: siteConfig.creator }],
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      publishedTime,
      modifiedTime,
      tags,
      section,
      authors: authorName ? [authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

// ═══════════════════════════════════════════════
// TOPIC METADATA
// ═══════════════════════════════════════════════

export function generateTopicSEO(topic: {
  name: string;
  slug: string;
  description?: string;
  category?: string;
}): Metadata {
  const title = `${topic.name} Interview Questions, Notes & Roadmap`;
  const description =
    topic.description ||
    `Comprehensive ${topic.name} interview preparation — questions, notes, roadmaps, cheat sheets and coding problems.`;

  return generateSEO({
    title,
    description,
    path: `/topics/${topic.slug}`,
    keywords: [
      `${topic.name} interview questions`,
      `${topic.name} notes`,
      `${topic.name} roadmap`,
      `${topic.name} cheat sheet`,
      `${topic.name} tutorial`,
      `learn ${topic.name}`,
      ...(topic.category ? [`${topic.category} interview`] : []),
    ],
  });
}

// ═══════════════════════════════════════════════
// COMPANY METADATA
// ═══════════════════════════════════════════════

export function generateCompanySEO(company: {
  name: string;
  slug: string;
  description?: string;
}): Metadata {
  const title = `${company.name} Interview Questions & Experiences`;
  const description =
    company.description ||
    `Prepare for ${company.name} interviews with real questions, salary insights, interview experiences, and tips from engineers.`;

  return generateSEO({
    title,
    description,
    path: `/companies/${company.slug}`,
    keywords: [
      `${company.name} interview`,
      `${company.name} interview questions`,
      `${company.name} salary`,
      `${company.name} interview experience`,
      `${company.name} hiring process`,
    ],
  });
}

// ═══════════════════════════════════════════════
// PROGRAMMATIC SEO — COMPOUND PAGES
// ═══════════════════════════════════════════════

export function generateCompanyTopicSEO(company: string, topic: string, slug: string): Metadata {
  const title = `${topic} Interview Questions at ${company}`;
  const description = `Top ${topic} interview questions asked at ${company}. Real questions from ${company} interviews with detailed answers and tips.`;

  return generateSEO({
    title,
    description,
    path: `/companies/${slug}/${topic.toLowerCase().replace(/\s+/g, "-")}-interview-questions`,
    keywords: [
      `${company} ${topic} interview`,
      `${topic} questions ${company}`,
      `${company} ${topic} hiring`,
      `${company} technical interview`,
    ],
  });
}

export function generateExperienceLevelSEO(topic: string, level: string, slug: string): Metadata {
  const title = `${topic} Interview Questions for ${level}`;
  const description = `${topic} interview questions tailored for ${level}. Practice with real-world questions matching your experience level.`;

  return generateSEO({
    title,
    description,
    path: `/interview/${slug}`,
    keywords: [
      `${topic} interview ${level}`,
      `${topic} questions ${level}`,
      `${level} ${topic} interview`,
    ],
  });
}

export function generateRoadmapSEO(roadmap: {
  title: string;
  slug: string;
  description?: string;
}): Metadata {
  const title = `${roadmap.title} — Learning Roadmap`;
  const description =
    roadmap.description ||
    `Step-by-step learning roadmap for ${roadmap.title}. Master every concept from beginner to advanced.`;

  return generateSEO({
    title,
    description,
    path: `/roadmaps/${roadmap.slug}`,
    keywords: [
      `${roadmap.title} roadmap`,
      `learn ${roadmap.title}`,
      `${roadmap.title} learning path`,
      `${roadmap.title} guide`,
    ],
  });
}

export function generateCheatSheetSEO(cheatSheet: {
  title: string;
  slug: string;
  topicName?: string;
}): Metadata {
  const title = `${cheatSheet.title} — Cheat Sheet`;
  const description = `Quick reference cheat sheet for ${cheatSheet.title}. All essential concepts, syntax, and tips in one place.`;

  return generateSEO({
    title,
    description,
    path: `/cheatsheets/${cheatSheet.slug}`,
    keywords: [
      `${cheatSheet.title} cheat sheet`,
      `${cheatSheet.title} quick reference`,
      ...(cheatSheet.topicName ? [`${cheatSheet.topicName} cheat sheet`] : []),
    ],
  });
}

export function generateCodingProblemSEO(problem: {
  title: string;
  slug: string;
  difficulty?: string;
  tags?: string[];
}): Metadata {
  const title = `${problem.title} — Solution & Explanation`;
  const description = `Solve "${problem.title}"${problem.difficulty ? ` (${problem.difficulty})` : ""}. Step-by-step solution with multiple approaches, time & space complexity analysis.`;

  return generateSEO({
    title,
    description,
    path: `/coding/${problem.slug}`,
    keywords: [
      problem.title,
      `${problem.title} solution`,
      ...(problem.tags || []),
      ...(problem.difficulty ? [`${problem.difficulty} coding problem`] : []),
    ],
  });
}
