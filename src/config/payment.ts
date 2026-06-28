// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Payment Configuration
// ══════════════════════════════════════════════════════════════

export const paymentConfig = {
  provider: "stripe" as const,
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  plans: {
    free: { price: 0, label: "Free" },
    pro: { priceMonthly: 999, priceYearly: 9990, label: "Pro" },
    enterprise: { priceMonthly: 2999, priceYearly: 29990, label: "Enterprise" },
  },
  currency: "usd" as const,
} as const;
