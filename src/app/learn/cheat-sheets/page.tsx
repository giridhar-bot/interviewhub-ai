import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Cheat Sheets — Quick Reference Guides",
  description:
    "Quick-reference cheat sheets for Java, React, SQL, Docker, AWS, Git, and more. Concise syntax guides, commands, and best practices.",
  path: "/learn/cheat-sheets",
  keywords: ["cheat sheets", "quick reference", "syntax guide", "command reference"],
});

async function getPublishedCheatSheets() {
  return prisma.cheatSheet.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      topic: { select: { name: true, slug: true } },
    },
  });
}

export default async function CheatSheetsPage() {
  const sheets = await getPublishedCheatSheets();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Cheat Sheets", href: "/learn/cheat-sheets" },
          ])),
        }}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Cheat Sheets</h1>
        <p className="mt-2 text-muted-foreground">
          Quick-reference guides for syntax, commands, patterns, and best
          practices.
        </p>
      </div>

      {sheets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => (
            <Link key={sheet.id} href={`/learn/cheat-sheets/${sheet.slug}`}>
              <Card className="group h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {sheet.topic.name}
                  </Badge>
                  <CardTitle className="mt-2 group-hover:text-primary transition-colors">
                    {sheet.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    Quick reference for {sheet.topic.name}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No cheat sheets yet</h2>
          <p className="mt-1 text-muted-foreground">Check back soon for quick reference guides.</p>
        </div>
      )}
    </div>
  );
}
