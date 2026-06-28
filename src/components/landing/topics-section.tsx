"use client";

import { topicCategories } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";

export function TopicsSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            50+ Technologies &{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Growing
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From Java to SAP, React to AWS — comprehensive interview preparation
            for every tech stack.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topicCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${category.bgColor}`}
                >
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.topics.map((topic) => (
                  <Link
                    key={topic}
                    href={`/topics/${topic.toLowerCase().replace(/[\s.]+/g, "-")}`}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer transition-colors hover:bg-violet-100 hover:text-violet-700"
                    >
                      {topic}
                    </Badge>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
