"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/solid";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/50 via-background to-background py-20 sm:py-32">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 rounded-full px-4 py-1.5 text-sm"
          >
            <SparklesIcon className="h-3.5 w-3.5 text-violet-600" />
            AI-Powered Interview Preparation
          </Badge>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Ace Every Interview with{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Preparation
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl">
            The all-in-one platform for interview prep — notes, coding practice,
            AI mock interviews, resume review, roadmaps, and 50+ tech stacks.
            Everything you need in one place.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="h-11 w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 hover:shadow-violet-500/40 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
              >
                Start Preparing — It&apos;s Free
              </Button>
            </Link>
            <Link href="/topics">
              <Button
                variant="outline"
                size="lg"
                className="h-11 w-full rounded-full px-6 text-sm font-semibold sm:h-12 sm:w-auto sm:px-8 sm:text-base"
              >
                Explore Topics
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · Free forever plan available
          </p>
        </motion.div>
      </div>
    </section>
  );
}
