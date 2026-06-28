"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface QuizOption {
  id: string;
  text: string;
  order: number;
  questionId: string;
  isCorrect?: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  explanation?: string | null;
  order: number;
  points: number;
  options: QuizOption[];
  selectedOptionId?: string | null;
  isCorrect?: boolean;
}

interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  difficulty: string;
  timeLimit: number | null;
  topic: { name: string; slug: string };
  questions: QuizQuestion[];
}

type QuizState = "ready" | "taking" | "results";

export default function QuizTakePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [state, setState] = useState<QuizState>("ready");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState<{ score: number; total: number; xpEarned: number; quiz: Quiz } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      const res = await fetch(`/api/quizzes?action=attempt&slug=${params.slug}`);
      if (res.ok) setQuiz(await res.json());
      setLoading(false);
    }
    fetchQuiz();
  }, [params.slug]);

  const submitQuiz = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    const startTime = quiz.timeLimit ? quiz.timeLimit * 60 - timeLeft : undefined;
    const res = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit",
        quizId: quiz.id,
        answers,
        timeTaken: startTime,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      // Fetch full results with explanations
      const resResults = await fetch(`/api/quizzes?action=results&attemptId=${data.id}`);
      if (resResults.ok) {
        const fullResults = await resResults.json();
        setResults({ score: data.score, total: data.total, xpEarned: data.xpEarned, quiz: fullResults.quiz });
      }
      setState("results");
    }
    setSubmitting(false);
  }, [quiz, answers, timeLeft, submitting]);

  // Timer
  useEffect(() => {
    if (state !== "taking" || !quiz?.timeLimit) return;
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [state, timeLeft, quiz?.timeLimit, submitQuiz]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Quiz not found</h1>
        <Link href="/learn/quizzes">
          <Button variant="outline" className="mt-4">Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  // Ready state
  if (state === "ready") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Link
          href="/learn/quizzes"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Quizzes
        </Link>

        <Card className="p-8 text-center">
          <Badge variant="secondary" className="mb-4">{quiz.topic.name}</Badge>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          {quiz.description && (
            <p className="mt-2 text-muted-foreground">{quiz.description}</p>
          )}
          <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
            <span>{quiz.questions.length} questions</span>
            <span>
              <Badge variant={quiz.difficulty === "EASY" ? "default" : quiz.difficulty === "HARD" ? "destructive" : "outline"}>
                {quiz.difficulty}
              </Badge>
            </span>
            {quiz.timeLimit && <span>{quiz.timeLimit} minutes</span>}
          </div>
          <Button
            size="lg"
            className="mt-8"
            onClick={() => {
              setState("taking");
              if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
            }}
          >
            Start Quiz
          </Button>
        </Card>
      </div>
    );
  }

  // Results state
  if (state === "results" && results) {
    const percentage = Math.round((results.score / results.total) * 100);
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card className="mb-8 p-8 text-center">
          <h1 className="text-2xl font-bold">Quiz Results</h1>
          <div className="mt-6 flex justify-center gap-8">
            <div>
              <div className="text-4xl font-bold">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">+{results.xpEarned}</div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground">
            {results.score} / {results.total} points
          </p>
        </Card>

        {/* Question Review */}
        <div className="space-y-4">
          {results.quiz.questions.map((q, i) => (
            <Card key={q.id} className="p-5">
              <div className="flex items-start gap-3">
                {q.isCorrect ? (
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 shrink-0 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="font-medium">
                    {i + 1}. {q.question}
                  </p>
                  <div className="mt-2 space-y-1">
                    {q.options.map((o) => (
                      <div
                        key={o.id}
                        className={`rounded px-3 py-1.5 text-sm ${
                          o.isCorrect
                            ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                            : o.id === q.selectedOptionId
                            ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
                            : ""
                        }`}
                      >
                        {o.text}
                        {o.isCorrect && " ✓"}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push("/learn/quizzes")}>
            Back to Quizzes
          </Button>
          <Button onClick={() => { setState("ready"); setAnswers({}); setCurrentQ(0); setResults(null); }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Taking state
  const question = quiz.questions[currentQ];
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {quiz.questions.length}
        </span>
        {quiz.timeLimit && (
          <span className={`flex items-center gap-1 text-sm font-mono ${timeLeft < 60 ? "text-red-500" : ""}`}>
            <ClockIcon className="h-4 w-4" />
            {minutesLeft}:{secondsLeft.toString().padStart(2, "0")}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="mb-6 h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <Card className="p-6">
        <p className="text-lg font-medium">{question.question}</p>
        <div className="mt-4 space-y-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setAnswers({ ...answers, [question.id]: option.id })}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                answers[question.id] === option.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-accent"
              }`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          disabled={currentQ === 0}
          onClick={() => setCurrentQ((c) => c - 1)}
        >
          Previous
        </Button>
        {currentQ === quiz.questions.length - 1 ? (
          <Button onClick={submitQuiz} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={() => setCurrentQ((c) => c + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
