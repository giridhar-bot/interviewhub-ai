"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface QuizQuestion {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
}

interface QuizPlayerProps {
  questions: QuizQuestion[];
  duration?: number; // minutes
  onComplete?: (results: { score: number; total: number; answers: Record<string, string> }) => void;
  className?: string;
}

export function QuizPlayer({ questions, duration, onComplete, className }: QuizPlayerProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration ? duration * 60 : 0);

  useEffect(() => {
    if (!duration || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const q = questions[current];

  function handleAnswer(optionId: string) {
    setAnswers({ ...answers, [q.id]: optionId });
  }

  function handleSubmit() {
    const score = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
    setShowResult(true);
    onComplete?.({ score, total: questions.length, answers });
  }

  if (showResult) {
    const score = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
    return (
      <div className={cn("space-y-4 text-center", className)}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h2>
        <p className="text-4xl font-bold text-violet-600">
          {score}/{questions.length}
        </p>
        <p className="text-gray-500">{Math.round((score / questions.length) * 100)}% accuracy</p>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Question {current + 1} of {questions.length}
        </span>
        {duration && timeLeft > 0 && (
          <span className={cn("text-sm font-medium", timeLeft < 60 ? "text-red-500" : "text-gray-500")}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{q.text}</h3>
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleAnswer(opt.id)}
            className={cn(
              "w-full rounded-lg border-2 p-3 text-left text-sm transition-colors",
              answers[q.id] === opt.id
                ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
                : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
            )}
          >
            {opt.text}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="rounded-md px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800"
        >
          Previous
        </button>
        {current < questions.length - 1 ? (
          <button
            onClick={() => setCurrent(current + 1)}
            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
