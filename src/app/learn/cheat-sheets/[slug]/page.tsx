import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { compileMdxContent } from "@/lib/mdx";
import { generateCheatSheetSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCheatSheet(slug: string) {
  return prisma.cheatSheet.findUnique({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: { topic: { select: { name: true, slug: true } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sheet = await getCheatSheet(slug);
  if (!sheet) return { title: "Not Found" };
  return generateCheatSheetSEO({ title: sheet.title, slug: sheet.slug, topicName: sheet.topic.name });
}

export default async function CheatSheetPage({ params }: Props) {
  const { slug } = await params;
  const sheet = await getCheatSheet(slug);
  if (!sheet) notFound();

  let mdxContent: React.ReactNode;
  try {
    const { content } = await compileMdxContent(sheet.content);
    mdxContent = content;
  } catch {
    mdxContent = (
      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
        {sheet.content}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Cheat Sheets", href: "/learn/cheat-sheets" },
            { name: sheet.title, href: `/learn/cheat-sheets/${slug}` },
          ])),
        }}
      />

      <Link
        href="/learn/cheat-sheets"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Cheat Sheets
      </Link>

      <div className="mb-8">
        <Badge variant="secondary">{sheet.topic.name}</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {sheet.title}
        </h1>
      </div>

      <Separator className="mb-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-foreground">
        {mdxContent}
      </div>
    </div>
  );
}
