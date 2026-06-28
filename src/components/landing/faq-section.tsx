"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is InterviewHub AI really free?",
    answer:
      "Yes! Our free tier includes notes for all 50+ topics, basic interview questions, roadmaps, community access, and 5 AI tutor questions per day. You can prepare for interviews without paying anything.",
  },
  {
    question: "What technologies do you cover?",
    answer:
      "We cover 50+ tech stacks including Java, Spring Boot, React, Angular, Node.js, Python, AWS, Azure, Docker, Kubernetes, SAP, Salesforce, SQL, System Design, and many more. We add new topics every month.",
  },
  {
    question: "How does the AI Mock Interview work?",
    answer:
      "Our AI interviewer asks you questions based on your target role, experience level, and company. It evaluates your answers in real-time, gives feedback on technical accuracy, communication, and provides a performance score with improvement tips.",
  },
  {
    question: "Can the AI review my resume?",
    answer:
      "Yes! Upload your resume and our AI will check ATS compatibility, analyze keywords, review formatting, and provide specific improvement suggestions based on your target role and industry benchmarks.",
  },
  {
    question: "How is this different from LeetCode or GeeksforGeeks?",
    answer:
      "InterviewHub AI is an all-in-one ecosystem. Instead of using LeetCode for coding, GFG for theory, Glassdoor for experiences, and ChatGPT for doubts — you get everything unified: notes, coding, AI tutor, mock interviews, resume review, roadmaps, and community in one place.",
  },
  {
    question: "Do you support company-specific preparation?",
    answer:
      "Absolutely! We have company-specific preparation packs that include past interview questions, interview process details, salary insights, and tips from engineers who've cracked those companies.",
  },
  {
    question: "Can I use this on mobile?",
    answer:
      "Yes, our platform is fully responsive and mobile-first. You can prepare on the go from your phone or tablet with the same great experience.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about InterviewHub AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <Accordion className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border bg-card px-6 data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
