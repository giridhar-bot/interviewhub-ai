# InterviewHub AI — Deployment Guide

## Environments
- **Development**: Local Docker (docker-compose)
- **Preview**: Vercel Preview Deployments
- **Production**: Vercel + Neon + Upstash Redis

## Deployment Steps
1. Push to `main` branch
2. CI pipeline: lint → typecheck → build → security
3. CD pipeline: Vercel deploy → DB migration → health check

## Required Services
- Neon PostgreSQL
- Upstash Redis
- Cloudinary (images)
- Resend (email)
- Sentry (monitoring)
- Vercel Analytics
