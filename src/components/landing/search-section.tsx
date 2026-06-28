"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";

const trendingSearches = [
  "Java Interview Questions",
  "React Hooks",
  "System Design",
  "Spring Boot",
  "AWS Lambda",
  "SQL Joins",
  "SAP FICO",
  "Docker vs Kubernetes",
  "JavaScript Closures",
  "REST API",
];

export function SearchSection() {
  const [query, setQuery] = useState("");
  const filtered = trendingSearches.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold sm:text-3xl">
            What do you want to learn today?
          </h2>
          <div className="relative mt-6">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics, questions, roadmaps..."
              className="h-14 rounded-2xl pl-12 pr-4 text-base shadow-lg border-border/50 focus:border-primary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-muted-foreground mr-1 self-center">
              Trending:
            </span>
            {(query ? filtered : trendingSearches).slice(0, 6).map((term) => (
              <Link
                key={term}
                href={`/topics/${term.toLowerCase().replace(/[\s]+/g, "-")}`}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer text-xs transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {term}
                </Badge>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
