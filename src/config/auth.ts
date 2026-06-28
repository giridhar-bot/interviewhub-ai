// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Auth Configuration
// ══════════════════════════════════════════════════════════════

export const authConfig = {
  sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  jwtMaxAge: 24 * 60 * 60, // 1 day
  verificationTokenExpiry: 24 * 60 * 60, // 1 day
  passwordResetExpiry: 60 * 60, // 1 hour
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60, // 15 minutes
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
} as const;
