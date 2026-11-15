# InterviewHub AI — Deployment Guide

## Environments
- **Development**: Local Docker (docker-compose)
- **Preview**: Vercel Preview Deployments
- **Production**: Vercel + Neon + Upstash Redis

## Deployment Steps
1. Push to `main` branch
2. CI pipeline: lint → typecheck → build → security
3. CD pipeline: Vercel deploy → DB migration → health check

## GitHub Actions and Vercel Secrets
- CD and Preview link the project and upload source with `vercel deploy`. Vercel builds remotely using its configured environment variables.
- Do not use `vercel pull` followed by `vercel build --prebuilt` for Secret variables: pulled Secret values become literal `[SENSITIVE]` placeholders. For example, `NEXTAUTH_URL` then causes Auth.js to throw `ERR_INVALID_URL`.
- Keep `NEXTAUTH_SECRET`, database credentials and provider keys private in Vercel. No conversion to readable Config values is required for remote builds.
- GitHub Actions requires `VERCEL_TOKEN`. Set `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` to select the intended team/project explicitly; without them, linking uses the CLI account's default team and repository directory name.
- The separate database migration job requires a GitHub Actions `DATABASE_URL` secret. A successful remote build does not verify database connectivity or runtime authentication.
- CD passes the actual deployment URL to its health check rather than checking an unrelated default domain.
- Vercel Git integration can also deploy the same push independently. Its deployment status and GitHub CD job status are separate.

## Required Services
- Neon PostgreSQL
- Upstash Redis
- Cloudinary (images)
- Resend (email)
- Sentry (monitoring)
- Vercel Analytics
