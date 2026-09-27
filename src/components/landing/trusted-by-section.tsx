"use client";

import { motion } from "framer-motion";

type Company = { name: string; slug: string };

export function TrustedBySection({ companies }: { companies: Company[] }) {
  return (
    <section className="border-b py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 text-center text-sm font-medium text-muted-foreground"
        >
          Companies in our interview preparation library
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8 sm:gap-y-4">
          {companies.map((company, index) => (
            <motion.span
              key={company.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="text-sm font-semibold text-muted-foreground/50 transition-colors hover:text-foreground sm:text-lg"
            >
              {company.name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
