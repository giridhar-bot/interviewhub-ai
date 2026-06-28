import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance
  reactStrictMode: true,
  poweredByHeader: false,

  // Docker standalone output
  output: "standalone",

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  // Security headers handled in middleware
  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
