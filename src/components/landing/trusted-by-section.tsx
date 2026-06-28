"use client";

import { motion } from "framer-motion";

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple",
  "Netflix", "Flipkart", "Infosys", "TCS", "Wipro",
  "Accenture", "Deloitte",
];

export function TrustedBySection() {
  return (
    <section className="border-b py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 text-center text-sm font-medium text-muted-foreground"
        >
          Trusted by engineers preparing for top companies
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {companies.map((company, i) => (
            <motion.span
              key={company}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-lg font-semibold text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              {company}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
