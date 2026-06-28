import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { MapIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Roadmaps — Step-by-Step Learning Paths",
  description:
    "Follow curated roadmaps for Java, Spring Boot, React, AWS, DevOps, Data Engineering, SAP, and System Design. Track your progress step by step.",
  path: "/learn/roadmaps",
  keywords: ["learning roadmaps", "developer roadmap", "interview preparation roadmap"],
});

async function getPublishedRoadmaps() {
  return prisma.roadmap.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      topic: { select: { name: true, slug: true } },
      _count: { select: { steps: true, progress: true } },
    },
  });
}

export default async function RoadmapsPage() {
  const roadmaps = await getPublishedRoadmaps();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Roadmaps", href: "/learn/roadmaps" },
          ])),
        }}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Roadmaps</h1>
        <p className="mt-2 text-muted-foreground">
          Structured learning paths from beginner to expert. Track your progress
          step by step.
        </p>
      </div>

      {roadmaps.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((rm) => (
            <Link key={rm.id} href={`/learn/roadmaps/${rm.slug}`}>
              <Card className="group h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {rm.topic.name}
                  </Badge>
                  <CardTitle className="mt-2 group-hover:text-primary transition-colors">
                    {rm.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {rm.description || `${rm._count.steps} steps to master ${rm.topic.name}`}
                  </CardDescription>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      {rm._count.steps} steps
                    </span>
                    <span>{rm._count.progress} learners</span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <MapIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No roadmaps published yet</h2>
          <p className="mt-1 text-muted-foreground">Check back soon for learning paths.</p>
        </div>
      )}
    </div>
  );
}
