import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { generateRoadmapSEO } from "@/lib/seo";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/json-ld";
import {
  CheckCircleIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getRoadmap(slug: string) {
  return prisma.roadmap.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      topic: { select: { id: true, name: true, slug: true } },
      steps: { orderBy: { order: "asc" } },
      _count: { select: { progress: true } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);
  if (!roadmap) return { title: "Not Found" };
  return generateRoadmapSEO({ title: roadmap.title, slug: roadmap.slug, description: roadmap.description || undefined });
}

export default async function RoadmapPage({ params }: Props) {
  const { slug } = await params;
  const roadmap = await getRoadmap(slug);
  if (!roadmap) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Roadmaps", href: "/learn/roadmaps" },
            { name: roadmap.title, href: `/learn/roadmaps/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseJsonLd({
            title: roadmap.title,
            description: roadmap.description || `Complete roadmap for ${roadmap.topic.name}`,
            slug: roadmap.slug,
            provider: "InterviewHub AI",
          })),
        }}
      />

      <Link
        href="/learn/roadmaps"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Roadmaps
      </Link>

      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary">{roadmap.topic.name}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {roadmap.title}
        </h1>
        {roadmap.description && (
          <p className="mt-3 text-lg text-muted-foreground">{roadmap.description}</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span>{roadmap.steps.length} steps</span>
          <span>{roadmap._count.progress} learners</span>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Steps */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {roadmap.steps.map((step, index) => {
            const resources = step.resources as {
              links?: { title: string; url: string }[];
              articles?: string[];
            } | null;

            return (
              <div key={step.id} className="relative flex gap-4">
                {/* Step indicator */}
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-sm font-semibold">
                  {index + 1}
                </div>

                {/* Step content */}
                <Card className="flex-1 p-5">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  {step.description && (
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  )}
                  {resources?.links && resources.links.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {resources.links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <LinkIcon className="h-3.5 w-3.5" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
