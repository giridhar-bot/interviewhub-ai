import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = generateSEO({
  title: "Flashcards — Spaced Repetition Review Decks",
  description:
    "Study with spaced-repetition flashcard decks for Java, React, AWS, SQL, and more. SM-2 algorithm optimizes your review schedule.",
  path: "/learn/flashcards",
  keywords: ["flashcards", "spaced repetition", "interview flashcards", "study cards"],
});

async function getPublishedDecks() {
  return prisma.flashcardDeck.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: {
      topic: { select: { name: true, slug: true } },
      _count: { select: { flashcards: true } },
    },
  });
}

export default async function FlashcardsPage() {
  const decks = await getPublishedDecks();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Learn", href: "/learn" },
            { name: "Flashcards", href: "/learn/flashcards" },
          ])),
        }}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Flashcards</h1>
        <p className="mt-2 text-muted-foreground">
          Spaced-repetition flashcard decks to boost your retention. Review daily
          for maximum impact.
        </p>
      </div>

      {decks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <Link key={deck.id} href={`/learn/flashcards/${deck.slug}`}>
              <Card className="group h-full transition-shadow hover:shadow-lg">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit">
                    {deck.topic.name}
                  </Badge>
                  <CardTitle className="mt-2 group-hover:text-primary transition-colors">
                    {deck.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {deck.description || `${deck._count.flashcards} cards to study`}
                  </CardDescription>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <RectangleStackIcon className="mr-1 inline h-4 w-4" />
                    {deck._count.flashcards} cards
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <RectangleStackIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No flashcard decks yet</h2>
          <p className="mt-1 text-muted-foreground">Check back soon for study decks.</p>
        </div>
      )}
    </div>
  );
}
