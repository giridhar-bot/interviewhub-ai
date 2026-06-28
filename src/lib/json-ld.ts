import { siteConfig } from "@/config/site";

// ═══════════════════════════════════════════════
// JSON-LD STRUCTURED DATA HELPERS
// ═══════════════════════════════════════════════

type JsonLdData = Record<string, unknown>;

export function jsonLdScript(data: JsonLdData): string {
  return JSON.stringify(data);
}

// ─── Organization ────────────────────────────

export function organizationJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.organization.name,
    url: siteConfig.url,
    logo: siteConfig.organization.logo,
    foundingDate: siteConfig.organization.foundingDate,
    sameAs: siteConfig.organization.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${siteConfig.url}/contact`,
    },
  };
}

// ─── WebSite + SearchAction ──────────────────

export function websiteJsonLd(): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.organization.logo,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── BreadcrumbList ──────────────────────────

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

// ─── Article ─────────────────────────────────

export function articleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  authorUrl?: string;
  image?: string;
  tags?: string[];
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${siteConfig.url}/articles/${article.slug}`,
    image: article.image || `${siteConfig.url}/api/og?title=${encodeURIComponent(article.title)}&type=article`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.authorName || siteConfig.creator,
      url: article.authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organization.name,
      logo: {
        "@type": "ImageObject",
        url: siteConfig.organization.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/articles/${article.slug}`,
    },
    keywords: article.tags?.join(", "),
  };
}

// ─── FAQPage ─────────────────────────────────

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[]
): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── Course (for learning roadmaps) ──────────

export function courseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
  provider?: string;
  duration?: string;
  image?: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${siteConfig.url}/roadmaps/${course.slug}`,
    provider: {
      "@type": "Organization",
      name: course.provider || siteConfig.organization.name,
      url: siteConfig.url,
    },
    image: course.image,
    ...(course.duration && { timeRequired: course.duration }),
  };
}

// ─── Person (for user profiles) ──────────────

export function personJsonLd(person: {
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  url?: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: person.url || `${siteConfig.url}/profile/${person.username}`,
    image: person.avatar,
    description: person.bio,
  };
}

// ─── VideoObject ─────────────────────────────

export function videoObjectJsonLd(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    ...(video.duration && { duration: video.duration }),
    ...(video.contentUrl && { contentUrl: video.contentUrl }),
    ...(video.embedUrl && { embedUrl: video.embedUrl }),
  };
}

// ─── SoftwareSourceCode (coding problems) ────

export function codingProblemJsonLd(problem: {
  title: string;
  description: string;
  slug: string;
  difficulty?: string;
  tags?: string[];
}): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: problem.title,
    description: problem.description,
    url: `${siteConfig.url}/coding/${problem.slug}`,
    learningResourceType: "Problem",
    educationalLevel: problem.difficulty,
    keywords: problem.tags?.join(", "),
    provider: {
      "@type": "Organization",
      name: siteConfig.organization.name,
    },
  };
}

// ─── ItemList (for listing pages) ────────────

export function itemListJsonLd(items: { name: string; url: string; position?: number }[]): JsonLdData {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position || index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}
