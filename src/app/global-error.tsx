"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center font-sans">
          <div className="relative mb-8">
            <span className="text-[10rem] font-extrabold leading-none text-gray-100">
              500
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">⚠️</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-md text-gray-500">
            We hit an unexpected error. Our team has been notified. Please try
            again.
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-medium text-white hover:opacity-90"
            >
              Try Again
            </button>
            <a
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 px-6 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
