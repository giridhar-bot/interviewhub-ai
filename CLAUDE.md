# InterviewHub AI — Master Development Guide

> Single source of truth for AI-assisted & manual development.

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- Prisma 7 + PostgreSQL 16
- Auth.js v5 (JWT strategy)
- Tailwind CSS v4 + shadcn/ui v4
- TanStack React Query + Zustand
- Zod v4 validation
- Redis (ioredis)
- MDX (next-mdx-remote)
- Vercel AI SDK v7
- Docker + GitHub Actions CI/CD

## Architecture

- Feature-first folder structure (`src/features/`)
- Repository pattern for DB access (`src/repositories/`)
- Service layer for business logic (`src/services/`)
- Server Components by default; Client Components only when needed
- Server Actions for mutations
- Route Handlers for REST APIs
- No business logic inside pages or components

## Coding Rules

- Production-ready code only — no placeholder implementations
- Strict TypeScript — no `any`, no `@ts-ignore`
- Zod for all validation (API inputs, forms, env)
- Prisma for all database access — no raw SQL outside migrations
- Repository pattern only — no Prisma queries in components
- Keep UI and business logic separated
- Write reusable components with typed props
- Prefer composition over inheritance

## Folder Rules

- One feature = one module under `src/features/`
- Shared utilities → `src/utils/`
- Shared library code → `src/lib/`
- Config → `src/config/` (read env only here)
- Components → `src/components/{domain}/`
- No duplicated logic across modules
- Barrel exports where appropriate

## UI Rules

- shadcn/ui primitives (base-ui, NOT radix-ui)
- No `asChild` prop — wrap Link around Button
- Responsive by default (mobile-first)
- WCAG 2.2 AA accessibility
- Dark/light theme support via next-themes
- Consistent spacing via Tailwind
- Framer Motion for animations (150–250ms)
- Skeleton loading for async content
- Support reduced motion preferences

## API Rules

- RESTful route handlers under `src/app/api/`
- Typed request/response with Zod schemas
- Standard response format: `{ success, message, data, meta }`
- Standard error format: `{ success: false, code, message, requestId }`
- RBAC via `requireAuth()` for protected endpoints
- Rate limiting on public endpoints
- No raw errors exposed to clients

## Database Rules

- Prisma migrations only (`npx prisma migrate dev`)
- Soft delete via `deletedAt` where required
- Index all searchable/filterable fields
- Avoid N+1 queries — use `include` and `select`
- Transactions for multi-step writes
- UUID primary keys
- Import from `@/generated/prisma/client`
- Adapter: `@prisma/adapter-pg` with `PrismaPg`

## SEO Rules

- `generateSEO()` for all page metadata
- Dynamic sitemap via `src/app/sitemap.ts`
- `robots.txt` via `src/app/robots.ts`
- JSON-LD structured data via `breadcrumbJsonLd()`
- Open Graph images via `/api/og`
- Canonical URLs on every page
- Internal linking strategy
- BreadcrumbItem uses `href` (NOT `url`)

## Security Rules

- RBAC with `RoleType` enum
- Rate limiting (API + auth routes)
- Input sanitization (sanitize-html)
- Secure cookies (httpOnly, sameSite, secure)
- CSRF protection for state-changing operations
- Audit logging for admin actions
- Never expose secrets to client
- CSP and security headers

## Performance Rules

- Server Components first — minimize client JS
- Lazy-load heavy components (`next/dynamic`)
- Image optimization (`next/image`)
- Redis caching with TTL strategy
- Pagination everywhere (max 50 per page)
- Streaming & Suspense for loading states
- Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1

## Testing Rules

- Unit tests for services, utils, repositories
- Integration tests for API routes
- E2E tests for critical user flows
- Mock external services (AI, email, payments)
- Test fixtures in `tests/fixtures/`
- Test mocks in `tests/mocks/`

## Version-Specific Notes

- **Prisma v7**: Use `@prisma/adapter-pg`, output to `src/generated/prisma`, import from `@/generated/prisma/client`
- **AI SDK v7**: `ModelMessage` (not CoreMessage), `LanguageModel` (not LanguageModelV1), `maxOutputTokens`, `toTextStreamResponse()`
- **Zod v4**: `.issues` (not `.errors`), `z.record()` requires 2 args
- **shadcn v4**: Uses `@base-ui/react`, no `asChild` prop
- **Next.js 16**: `middleware.ts` → proxy (deprecated warning is expected)

## Development Workflow

Requirements → Architecture → Database → API → Business Logic → UI → Testing → Optimization → Documentation → Deployment

## Quality Gates

- `npm run lint` passes
- `npm run typecheck` passes
- `npm run build` succeeds
- Tests pass
- No `console.log` in production code
- No TODOs in production code
- Documentation updated

@AGENTS.md
