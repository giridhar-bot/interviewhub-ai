"use client";

import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Ankit Sharma",
    role: "SDE-2 at Google",
    content:
      "InterviewHub AI's system design section and AI mock interviews were game changers. I prepared in 2 months and cracked Google L4!",
    initials: "AS",
  },
  {
    name: "Priya Menon",
    role: "Frontend Engineer at Flipkart",
    content:
      "The React roadmap and coding practice helped me go from zero DSA knowledge to cracking Flipkart in 3 months. The AI tutor answered all my doubts instantly.",
    initials: "PM",
  },
  {
    name: "Rahul Jain",
    role: "SAP Consultant at Deloitte",
    content:
      "Finally a platform that covers SAP interview questions! The company-wise preparation packs are incredibly useful.",
    initials: "RJ",
  },
  {
    name: "Sneha Reddy",
    role: "Backend Engineer at Amazon",
    content:
      "The personalized study planner kept me on track. AI resume review helped me optimize my resume and get 3x more callbacks.",
    initials: "SR",
  },
  {
    name: "Vikram Thakur",
    role: "DevOps Engineer at Microsoft",
    content:
      "AWS and Kubernetes sections are top-notch. The community interview experiences gave me real insights into what to expect.",
    initials: "VT",
  },
  {
    name: "Kavitha Nair",
    role: "Full Stack Dev at Razorpay",
    content:
      "I love the dark mode and clean UI. The notes quality is on par with paid courses. Can't believe the free tier offers this much.",
    initials: "KN",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by{" "}
            <span className="text-gradient">Engineers Worldwide</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Real success stories from engineers who cracked their dream jobs
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 transition-shadow hover:shadow-lg">
                <CardHeader className="space-y-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
