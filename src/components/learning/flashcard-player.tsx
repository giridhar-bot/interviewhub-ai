"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardPlayerProps {
  cards: Flashcard[];
  onComplete?: (results: { id: string; confidence: number }[]) => void;
  className?: string;
}

export function FlashcardPlayer({ cards, onComplete, className }: FlashcardPlayerProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<{ id: string; confidence: number }[]>([]);

  const card = cards[current];
  if (!card) return null;

  function handleRate(confidence: number) {
    const newResults = [...results, { id: card.id, confidence }];
    setResults(newResults);
    setFlipped(false);
    if (current + 1 >= cards.length) {
      onComplete?.(newResults);
    } else {
      setCurrent(current + 1);
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-sm text-gray-500">
        Card {current + 1} of {cards.length}
      </div>
      <div
        onClick={() => setFlipped(!flipped)}
        className="flex min-h-[200px] cursor-pointer items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-8 text-center transition-all hover:border-violet-300 dark:border-gray-700 dark:bg-gray-950"
      >
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          {flipped ? card.back : card.front}
        </p>
      </div>
      {!flipped && (
        <p className="text-center text-sm text-gray-500">Click to reveal answer</p>
      )}
      {flipped && (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleRate(n)}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                n <= 2
                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                  : n === 3
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
