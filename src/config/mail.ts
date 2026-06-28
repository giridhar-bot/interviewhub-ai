// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Mail Configuration
// ══════════════════════════════════════════════════════════════

export const mailConfig = {
  provider: "resend" as const,
  from: process.env.EMAIL_FROM || "InterviewHub AI <noreply@interviewhub.ai>",
  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },
  templates: {
    verification: "email-verification",
    passwordReset: "password-reset",
    welcome: "welcome",
    weeklyDigest: "weekly-digest",
  },
} as const;
