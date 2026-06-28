# ══════════════════════════════════════════════════════════════
# InterviewHub AI — Production Readiness Checklist
# ══════════════════════════════════════════════════════════════

## Pre-Deployment

- [ ] All environment variables configured in Vercel
- [ ] DATABASE_URL points to production Neon PostgreSQL
- [ ] REDIS_URL points to production Upstash Redis
- [ ] NEXTAUTH_SECRET is a strong random string (32+ chars)
- [ ] NEXTAUTH_URL matches production domain
- [ ] OAuth providers configured with production redirect URIs
- [ ] AI API keys set (OpenAI, Anthropic, Google)
- [ ] Resend API key configured
- [ ] Sentry DSN configured

## Database

- [ ] Prisma migrations applied (`prisma migrate deploy`)
- [ ] Seed data loaded (badges, topics, companies)
- [ ] Database backups enabled (Neon daily snapshots)
- [ ] Connection pooling configured

## Security

- [ ] SSL/TLS enabled on all endpoints
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] CSP headers configured
- [ ] Secret scanning enabled in GitHub
- [ ] No secrets committed to repository
- [ ] npm audit shows no high/critical vulnerabilities

## DNS & Domain

- [ ] Domain configured in Cloudflare
- [ ] DNS records pointing to Vercel
- [ ] SSL certificate provisioned
- [ ] www → apex redirect configured

## SEO & Analytics

- [ ] robots.txt verified (allows crawling)
- [ ] sitemap.xml generated and accessible
- [ ] Google Analytics 4 tracking verified
- [ ] Vercel Analytics enabled
- [ ] Open Graph images working
- [ ] Structured data (JSON-LD) validated

## Monitoring & Alerts

- [ ] Sentry error tracking verified
- [ ] Health check endpoint responds (`/api/health`)
- [ ] Uptime monitoring configured
- [ ] Alert thresholds set (error rate, latency)
- [ ] AI cost monitoring enabled

## Performance

- [ ] Lighthouse score > 95 on key pages
- [ ] Core Web Vitals within thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Redis caching operational
- [ ] Image optimization enabled (next/image)
- [ ] Static pages pre-rendered

## CI/CD

- [ ] GitHub Actions CI workflow passing
- [ ] CD pipeline deploying to correct environments
- [ ] Branch protection rules on main/staging
- [ ] Required reviews before merge to main

## Backup & Recovery

- [ ] Database backup schedule verified
- [ ] Rollback procedure documented and tested
- [ ] Previous deployment can be restored from Vercel
