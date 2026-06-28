"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Perfect for getting started with interview prep",
    features: [
      "Notes for all topics",
      "Basic interview questions",
      "Learning roadmaps",
      "Community access",
      "Cheat sheets",
      "5 AI Tutor questions/day",
    ],
    cta: "Get Started Free",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹101",
    period: "/month",
    description: "Everything you need to crack any interview",
    features: [
      "Everything in Free",
      "Unlimited AI Tutor",
      "AI Mock Interviews",
      "ATS Resume Review",
      "Company-wise Prep Packs",
      "Advanced analytics",
      "Priority support",
      "Ad-free experience",
    ],
    cta: "Start Pro Trial",
    href: "/auth/register?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For colleges, bootcamps & corporate training",
    features: [
      "Everything in Pro",
      "Bulk user management",
      "Custom branding",
      "Analytics dashboard",
      "API access",
      "Dedicated support",
      "Custom content",
      "SSO integration",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent{" "}
            <span className="text-gradient">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you&apos;re ready to go premium.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card
                className={`relative h-full overflow-visible ${
                  plan.popular
                    ? "border-primary shadow-xl glow-violet mt-4 sm:mt-0"
                    : "border-border/50"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 bg-brand-gradient text-white px-4 py-1 whitespace-nowrap">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="space-y-4 pt-8 sm:space-y-6">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {plan.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold sm:text-4xl">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <Link href={plan.href} className="block">
                    <Button
                      className={`w-full h-11 ${
                        plan.popular
                          ? "bg-brand-gradient text-white hover:opacity-90"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
