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
