"use client";

import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type HeroTopic = { name: string; slug: string; category: string };

export function HeroSection({
  topics,
  totalTopics,
}: {
  topics: HeroTopic[];
  totalTopics: number;
}) {
  const featuredTopics = topics.slice(0, 4);

  return (
    <section className="relative isolate overflow-hidden border-b bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20">
        <div className="grid items-center gap-6 md:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 border-l-2 border-emerald-500 pl-3 text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">
              <SparklesIcon className="h-4 w-4" />
              InterviewHub AI · Preparation workspace
            </div>

            <h1 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Make your next interview your best one.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-lg sm:leading-7">
              Build interview readiness with published topic guides, coding practice, company prep, and AI tools in one workspace.
            </p>

            <div className="mt-6 flex flex-col gap-3 min-[480px]:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="h-11 w-full gap-2 bg-emerald-500 px-5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 min-[480px]:w-auto sm:h-12 sm:px-6 sm:text-base">
                  Start preparing
                  <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/topics">
                <Button variant="outline" size="lg" className="h-11 w-full gap-2 px-5 text-sm min-[480px]:w-auto sm:h-12 sm:px-6 sm:text-base">
                  Browse topics
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {totalTopics.toLocaleString()} published topics
              </span>
              <span>Free to get started</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div aria-hidden="true" className="absolute -right-3 -top-3 h-16 w-16 border-r-2 border-t-2 border-orange-400/80" />
            <div className="relative overflow-hidden rounded-lg border bg-card shadow-xl">
              <div className="flex items-center justify-between border-b px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Live library</p>
                  <p className="mt-1 text-lg font-bold">Explore a topic</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                  <SparklesIcon className="h-5 w-5" />
                </div>
              </div>

              {featuredTopics.length ? (
                <div className="divide-y">
                  {featuredTopics.map((topic, index) => (
                    <Link
                      key={topic.slug}
                      href={`/topics/${topic.slug}`}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs text-muted-foreground">
                        0{index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                          {topic.name}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">{topic.category}</span>
                      </span>
                      <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                  Published topics will appear here.
                </p>
              )}

              <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
                <span>Browse the learning library</span>
                <Link href="/topics" className="font-semibold text-foreground hover:text-emerald-700 dark:hover:text-emerald-300">
                  View all <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}