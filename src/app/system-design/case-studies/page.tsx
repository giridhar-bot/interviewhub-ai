import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "System Design Case Studies — Real-World Architecture",
  description:
    "Learn system design through real-world case studies. URL Shortener, WhatsApp, Uber, Netflix, Twitter, and more with complete HLD/LLD breakdowns.",
  path: "/system-design/case-studies",
  keywords: ["system design case studies", "HLD", "LLD", "architecture", "FAANG interview"],
});

const caseStudies = [
  { title: "URL Shortener", slug: "url-shortener", difficulty: "Easy", companies: ["Google", "Microsoft"], description: "Design a service like TinyURL with analytics, custom slugs, and rate limiting." },
  { title: "Chat System (WhatsApp)", slug: "chat-system", difficulty: "Hard", companies: ["Meta", "Google"], description: "Real-time messaging with group chats, media sharing, E2E encryption, and delivery receipts." },
  { title: "Ride Sharing (Uber)", slug: "ride-sharing", difficulty: "Hard", companies: ["Uber", "Lyft"], description: "Matching riders with drivers, real-time tracking, surge pricing, and route optimization." },
  { title: "Video Streaming (Netflix)", slug: "video-streaming", difficulty: "Hard", companies: ["Netflix", "Amazon"], description: "Video upload, transcoding, adaptive streaming, recommendation engine, and CDN." },
  { title: "Social Media Feed (Twitter)", slug: "social-feed", difficulty: "Medium", companies: ["Twitter", "Meta"], description: "News feed generation, fan-out, real-time updates, trending topics, and search." },
  { title: "E-Commerce (Amazon)", slug: "ecommerce", difficulty: "Hard", companies: ["Amazon", "Flipkart"], description: "Product catalog, cart, checkout, inventory, payment processing, and recommendations." },
  { title: "Search Engine", slug: "search-engine", difficulty: "Hard", companies: ["Google", "Microsoft"], description: "Web crawling, indexing, ranking, autocomplete, and spell correction." },
  { title: "Notification System", slug: "notification-system", difficulty: "Medium", companies: ["Google", "Amazon"], description: "Push, email, SMS notifications with priority, rate limiting, and user preferences." },
  { title: "Rate Limiter", slug: "rate-limiter", difficulty: "Easy", companies: ["Stripe", "Cloudflare"], description: "Token bucket, sliding window, fixed window algorithms. Distributed rate limiting." },
  { title: "File Storage (Dropbox)", slug: "file-storage", difficulty: "Medium", companies: ["Google", "Dropbox"], description: "File upload/download, sync, deduplication, sharing, versioning, and chunking." },
  { title: "Payment System", slug: "payment-system", difficulty: "Hard", companies: ["Stripe", "PayPal"], description: "Payment processing, idempotency, reconciliation, fraud detection, and PCI compliance." },
  { title: "Distributed Cache", slug: "distributed-cache", difficulty: "Medium", companies: ["Amazon", "Meta"], description: "Consistent hashing, eviction policies, replication, cache invalidation strategies." },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "System Design", href: "/system-design" },
              { name: "Case Studies", href: "/system-design/case-studies" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Case{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Studies
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Learn system design by studying real-world architectures. Each case study includes
          complete HLD, LLD, API design, and trade-off analysis.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((cs) => (
          <Link key={cs.slug} href={`/system-design/${cs.slug}`}>
            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-violet-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{cs.title}</CardTitle>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[cs.difficulty]}`}>
                    {cs.difficulty}
                  </span>
                </div>
                <CardDescription className="mt-2">{cs.description}</CardDescription>
                <div className="mt-3 flex flex-wrap gap-1">
                  {cs.companies.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
