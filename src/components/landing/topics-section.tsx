"use client";

import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CircleStackIcon,
  CloudIcon,
  CodeBracketIcon,
  CpuChipIcon,
  PresentationChartBarIcon,
  ServerStackIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";

type TopicCategory = {
  title: string;
  topics: Array<{ name: string; slug: string }>;
};

const categoryStyles = {
  "DSA & Programming": { icon: CodeBracketIcon, color: "text-blue-600", bgColor: "bg-blue-50" },
  "Web Development": { icon: ServerStackIcon, color: "text-purple-600", bgColor: "bg-purple-50" },
  "System Design": { icon: PresentationChartBarIcon, color: "text-indigo-600", bgColor: "bg-indigo-50" },
  Databases: { icon: CircleStackIcon, color: "text-cyan-600", bgColor: "bg-cyan-50" },
  "DevOps & Cloud": { icon: CloudIcon, color: "text-orange-600", bgColor: "bg-orange-50" },
  "Core CS": { icon: CpuChipIcon, color: "text-green-600", bgColor: "bg-green-50" },
  Behavioral: { icon: ChatBubbleLeftRightIcon, color: "text-red-600", bgColor: "bg-red-50" },
  "AI & ML": { icon: SparklesIcon, color: "text-violet-600", bgColor: "bg-violet-50" },
};

const defaultCategoryStyle = {
  icon: AcademicCapIcon,
  color: "text-slate-600",
  bgColor: "bg-slate-50",
};

export function TopicsSection({ categories }: { categories: TopicCategory[] }) {
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
            Explore Interview Topics
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Browse published topics across programming, web development, system
            design, databases, and more.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => {
            const style = categoryStyles[category.title as keyof typeof categoryStyles] ?? defaultCategoryStyle;
            const CategoryIcon = style.icon;

            return (
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
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.bgColor}`}
                  >
                    <CategoryIcon className={`h-5 w-5 ${style.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.topics.map((topic) => (
                    <Link key={topic.slug} href={`/topics/${topic.slug}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer transition-colors hover:bg-violet-100 hover:text-violet-700"
                      >
                        {topic.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
