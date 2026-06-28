# ══════════════════════════════════════════════════════════════
# InterviewHub AI — Multi-stage Dockerfile
# Optimized for production with standalone output
# ══════════════════════════════════════════════════════════════

# ─── Base ────────────────────────────────────
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ─── Dependencies ────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
# Generate Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# ─── Builder ─────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry opt-out
ENV NEXT_TELEMETRY_DISABLED=1

# Build requires these at build time (dummy values for static pages)
ARG DATABASE_URL=""
ARG NEXTAUTH_SECRET="build-secret"
ARG NEXTAUTH_URL="http://localhost:3000"

RUN npm run build

# ─── Runner ──────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema + generated client for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/generated ./src/generated

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
