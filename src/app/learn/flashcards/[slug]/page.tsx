"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  order: number;
}

interface Deck {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  cardCount: number;
  topic: { name: string; slug: string };
  flashcards: Flashcard[];
}

export default function FlashcardStudyPage() {
  const params = useParams<{ slug: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeck() {
      const res = await fetch(`/api/flashcards?slug=${params.slug}`);
      if (res.ok) {
        const data = await res.json();
        setDeck(data);
      }
      setLoading(false);
    }
    fetchDeck();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!deck || deck.flashcards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Deck not found</h1>
        <Link href="/learn/flashcards">
          <Button variant="outline" className="mt-4">Back to Flashcards</Button>
        </Link>
      </div>
    );
  }

  const currentCard = deck.flashcards[currentIndex];

  const handleAnswer = async (quality: number) => {
    setReviewed((r) => r + 1);
    if (quality >= 3) setCorrect((c) => c + 1);

    // Submit review to API
    fetch("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "review",
        deckId: deck.id,
        cardId: currentCard.id,
        quality,
      }),
    }).catch(() => {});

    if (currentIndex + 1 >= deck.flashcards.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewed(0);
    setCorrect(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const percentage = Math.round((correct / reviewed) * 100);
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold">Session Complete!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You reviewed {reviewed} cards
          </p>
          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{correct}</div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{reviewed - correct}</div>
              <div className="text-sm text-muted-foreground">Needs Review</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={reset} variant="outline" className="gap-2">
              <ArrowPathIcon className="h-4 w-4" />
              Study Again
            </Button>
            <Link href="/learn/flashcards">
              <Button>Back to Decks</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/learn/flashcards"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back
        </Link>
        <div className="text-sm text-muted-foreground">
          {currentIndex + 1} / {deck.flashcards.length}
        </div>
      </div>

      <h1 className="mb-2 text-xl font-bold">{deck.title}</h1>
      <Badge variant="secondary" className="mb-6">{deck.topic.name}</Badge>

      {/* Progress Bar */}
      <div className="mb-6 h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${((currentIndex + 1) / deck.flashcards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <button
        type="button"
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full text-left"
      >
        <Card className="flex min-h-[300px] cursor-pointer items-center justify-center p-8 transition-all hover:shadow-lg">
          <div className="text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {isFlipped ? "Answer" : "Question"}
            </p>
            <p className="text-xl leading-relaxed">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
            {!isFlipped && (
              <p className="mt-4 text-sm text-muted-foreground">
                Click to reveal answer
              </p>
            )}
          </div>
        </Card>
      </button>

      {/* Rating Buttons — only show after flip */}
      {isFlipped && (
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleAnswer(1)}
            className="gap-1"
          >
            <XCircleIcon className="h-4 w-4" />
            Again
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAnswer(3)}
          >
            Good
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleAnswer(5)}
            className="gap-1"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Easy
          </Button>
        </div>
      )}
    </div>
  );
}
