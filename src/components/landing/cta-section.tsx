"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-5 py-12 text-center shadow-2xl sm:rounded-3xl sm:px-16 sm:py-24"
        >
          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Ready to Crack Your Next Interview?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-violet-100 sm:mt-4 sm:text-lg">
              Join thousands of engineers who are preparing smarter with
              AI-powered tools, personalized roadmaps, and expert content.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-white px-8 text-base font-semibold text-violet-700 shadow-lg hover:bg-violet-50"
                >
                  Get Started — It&apos;s Free
                </Button>
              </Link>
              <Link href="/topics">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-white/30 px-8 text-base font-semibold text-white hover:bg-white/10"
                >
                  Browse Topics
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
