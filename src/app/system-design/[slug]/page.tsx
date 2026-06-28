import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return generateSEO({
    title: `${title} — System Design Deep Dive`,
    description: `Learn how to design ${title}. Complete HLD/LLD breakdown with architecture diagrams, design decisions, trade-offs, and interview tips.`,
    path: `/system-design/${slug}`,
    keywords: [slug, "system design", "HLD", "LLD", "architecture"],
  });
}

const sections = [
  "Requirements",
  "High-Level Design",
  "API Design",
  "Data Model",
  "Detailed Design",
  "Scalability",
  "Trade-offs",
];

export default async function SystemDesignDetailPage({ params }: Props) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "System Design", href: "/system-design" },
              { name: title, href: `/system-design/${slug}` },
            ])
          ),
        }}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Design: {title}</h1>
            <Badge>HLD + LLD</Badge>
          </div>
          <p className="mt-2 text-muted-foreground">
            Complete system design breakdown with architecture, data model, and scalability analysis.
          </p>

          <Separator className="my-6" />

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>1. Requirements</h2>
            <h3>Functional Requirements</h3>
            <ul>
              <li>Users should be able to create, read, update, and delete resources</li>
              <li>System should support real-time updates</li>
              <li>Support search and filtering</li>
              <li>Authentication and authorization</li>
            </ul>
            <h3>Non-Functional Requirements</h3>
            <ul>
              <li>High availability (99.99% uptime)</li>
              <li>Low latency (&lt; 200ms p99)</li>
              <li>Horizontal scalability</li>
              <li>Data consistency (eventual for reads, strong for writes)</li>
            </ul>

            <h2>2. Capacity Estimation</h2>
            <ul>
              <li>DAU: 100M users</li>
              <li>Read/Write ratio: 100:1</li>
              <li>Storage: ~500TB over 5 years</li>
              <li>Bandwidth: ~1Gbps</li>
            </ul>

            <h2>3. High-Level Design</h2>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 p-8">
              <p className="text-muted-foreground">Architecture diagram (Mermaid/UML) will render here</p>
            </div>

            <h2>4. API Design</h2>
            <pre className="rounded-lg bg-muted p-4 text-sm">
              <code>{`POST   /api/v1/resource      — Create
GET    /api/v1/resource/:id  — Read
PUT    /api/v1/resource/:id  — Update
DELETE /api/v1/resource/:id  — Delete
GET    /api/v1/resource      — List (paginated)`}</code>
            </pre>

            <h2>5. Data Model</h2>
            <pre className="rounded-lg bg-muted p-4 text-sm">
              <code>{`Table: resource
  id          UUID PRIMARY KEY
  created_by  UUID REFERENCES users(id)
  content     TEXT
  metadata    JSONB
  created_at  TIMESTAMP
  updated_at  TIMESTAMP

Indexes:
  - (created_by, created_at DESC)
  - GIN index on metadata`}</code>
            </pre>

            <h2>6. Detailed Component Design</h2>
            <p>Key components include load balancer, API gateway, application servers,
            cache layer (Redis), primary database (PostgreSQL), message queue,
            and CDN for static assets.</p>

            <h2>7. Scalability & Trade-offs</h2>
            <ul>
              <li><strong>Caching:</strong> Redis for hot data, CDN for static content</li>
              <li><strong>Database:</strong> Read replicas + sharding for horizontal scale</li>
              <li><strong>Message Queue:</strong> Kafka for async processing</li>
              <li><strong>Trade-off:</strong> Eventual consistency for higher availability</li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Table of Contents</CardTitle>
            </CardHeader>
            <div className="space-y-1 px-6 pb-6">
              {sections.map((s, i) => (
                <div key={s} className="rounded-lg p-2 text-sm transition-colors hover:bg-muted/50 cursor-pointer">
                  {i + 1}. {s}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Difficulty</CardTitle>
              <Badge className="mt-2 bg-yellow-50 text-yellow-600">Medium</Badge>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Asked At</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-2 px-6 pb-6">
              {["Google", "Amazon", "Meta", "Microsoft"].map((c) => (
                <Badge key={c} variant="outline">{c}</Badge>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Related Designs</CardTitle>
            </CardHeader>
            <div className="space-y-2 px-6 pb-6">
              {[
                { name: "URL Shortener", slug: "url-shortener" },
                { name: "Chat System", slug: "chat-system" },
                { name: "News Feed", slug: "news-feed" },
              ].map((d) => (
                <Link
                  key={d.slug}
                  href={`/system-design/${d.slug}`}
                  className="block rounded-lg p-2 text-sm transition-colors hover:bg-muted/50"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
