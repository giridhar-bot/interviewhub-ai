# InterviewHub AI

The world's most comprehensive interview preparation ecosystem for IT professionals. AI-powered learning, coding practice, mock interviews, resume building & more.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Database | PostgreSQL 16 + Prisma 7 |
| Auth | Auth.js v5 (JWT) |
| Styling | Tailwind CSS v4 + shadcn/ui v4 |
| State | TanStack React Query + Zustand |
| AI | Vercel AI SDK v7 (OpenAI, Anthropic, Google) |
| Cache | Redis (ioredis) |
| Email | Resend |
| Deployment | Vercel + Docker |

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 16
- Redis 7

### Quick Start

```bash
# Clone & install
git clone https://github.com/interviewhubai/interviewhub-ai.git
cd interviewhub-ai
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values

# Setup database
npx prisma generate
npx prisma migrate dev

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker-compose up -d
```

This starts PostgreSQL, Redis, and the app.

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API routes
├── actions/       # Server Actions
├── components/    # UI components (ui/, layout/, feedback/, domain/)
├── config/        # Typed configuration (app, auth, ai, db, cache, mail, payment, storage)
├── constants/     # App-wide constants
├── features/      # Feature modules (auth, ai, learning, coding, etc.)
├── hooks/         # Custom React hooks
├── lib/           # Core libraries (prisma, auth, redis, seo, ai/, errors/)
├── middleware/     # Middleware helpers (auth, rate-limit, csrf, logging)
├── repositories/  # Database access layer (Prisma queries)
├── schemas/       # Zod validation schemas
├── services/      # Business logic & external API integrations
├── stores/        # Zustand stores
├── types/         # TypeScript type definitions
└── utils/         # Utility functions (dates, strings, arrays, pagination)
```

## Features

- **Learning Hub** — Topics, articles, roadmaps, flashcards, cheat sheets, quizzes
- **Company Prep** — Company profiles, interview questions, experiences, salary insights
- **Coding Platform** — DSA problems, code editor, test cases, contests, leaderboard
- **AI Tools** — AI tutor, mock interviews, HR interviews, resume review, code review
- **Resume Builder** — Templates, ATS scoring, version history, portfolio
- **Community** — Discussions, study groups, experiences, voting
- **Dashboard** — Progress tracking, streaks, achievements, analytics
- **Admin Panel** — User management, content moderation, feature flags, audit logs

## Scripts

### UI and account flow status

- Responsive header navigation uses a scrollable mobile/tablet drawer below 1280px.
- Email/password login and registration use validated, rate-limited Server Actions.
- OAuth buttons appear only when the matching provider credentials are configured.
- Settings load the signed-in user's profile; name, bio and timezone persist to the database.
- AI tutor, mock interview, resume text review and study planner screens call the existing AI APIs. Tutor streams retain the conversation ID and save completed assistant responses.
- Paid checkout is not implemented; paid-plan buttons are explicitly unavailable.
- Remaining work includes resume-builder editing/export, community composer, study-group membership, notification preferences, account deletion/export, admin mutation controls and production service configuration. Legal text needs owner review before deployment.
- Real OAuth, email delivery and AI generation require the matching credentials; do not treat mocked UI checks as provider integration verification.
- Run the focused Redis-disabled throttling regression tests with `npx tsx --test tests/rate-limit.test.ts`.

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run format` | Format with Prettier |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database |
| `npm run db:seed:content` | Validate and preview original learning content without writing |

## Publishing Learning Content

The content seed adds original interview Q&A, notes, roadmaps, cheat sheets, flashcards, quizzes, tested coding exercises, hypothetical architecture case studies, and resume section outlines. Editorial source metadata stays separate from published learning material; outbound bibliography sections are not displayed. Third-party articles and solutions are not copied.

```bash
# Audit current published coverage
npm run db:seed:content -- --inventory

# Validate content and execute reference-solution fixtures; no writes
npm run db:seed:content

# Explicitly publish to the verified target host
npm run db:seed:content -- --apply --expect-host <database-hostname>

# Remove optional bibliography sections from previously seeded content only
npm run db:seed:content -- --hide-public-references --apply --expect-host <database-hostname>

# Focused content and Markdown regression checks
npx tsx --test tests/content-seed.test.ts
```

Configure `DATABASE_URL` privately before running the commands. The publisher refuses an unexpected host, uses create-only writes and transactional topic groups, preserves existing content and settings, and verifies persisted child records. Repeating the command must report zero newly created records. It does not seed users, submissions, scores, salaries, company interview claims, or community experiences.

Bibliography cleanup is an explicit, repeatable operation: it updates only unchanged generated content matching the known earlier version and refuses to overwrite editor changes. Technical explanations, fenced code and later chapters are preserved.

Topic pages paginate questions in groups of 50, expose their answers, link to full notes, and link to revision decks and quizzes. Coding reference solutions are readable independently of the unfinished interactive judge.

## CI/CD

- **CI** (`ci.yml`) — Lint → Typecheck → Build → Security audit on PRs
- **CD** (`cd.yml`) — Auto-deploy to Vercel on merge to main/staging
- **Preview** (`preview.yml`) — Preview deployments on PRs
- **Release** (`release.yml`) — GitHub releases on version tags

## Environment Variables

See [`.env.example`](.env.example) for all required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `AUTH_SECRET` — NextAuth secret
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_AI_API_KEY` — AI providers
- `RESEND_API_KEY` — Email service
- `NEXT_PUBLIC_APP_URL` — Public app URL

## Architecture

- **Feature-first** design with shared components
- **Repository pattern** for database access
- **Service layer** for business logic
- **Server Components** by default
- **Zod validation** everywhere
- **RBAC** for authorization
- See [`CLAUDE.md`](CLAUDE.md) for full development guide

## License

Private — All rights reserved.
