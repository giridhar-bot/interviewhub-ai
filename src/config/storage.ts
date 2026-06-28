// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Storage Configuration
// ══════════════════════════════════════════════════════════════

export const storageConfig = {
  provider: "cloudinary" as const,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  upload: {
    maxSizeMB: 5,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  },
} as const;
