<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# InterviewHub AI — Agent Instructions

## Project
Interview preparation platform. See `CLAUDE.md` for full stack details and coding rules.

## Key Conventions
- **Prisma v7**: Import from `@/generated/prisma/client`, use `PrismaPg` adapter
- **AI SDK v7**: `ModelMessage`, `LanguageModel`, `maxOutputTokens`, `toTextStreamResponse()`
- **Zod v4**: `.issues` not `.errors`, `z.record(key, value)` requires 2 args
- **shadcn v4**: Uses `@base-ui/react` NOT `@radix-ui`. No `asChild` prop
- **RoleType enum**: `USER | PREMIUM | AUTHOR | MODERATOR | ADMIN | SUPER_ADMIN`
- **BreadcrumbItem**: Uses `href` NOT `url`
- **DB pages**: Need `export const dynamic = "force-dynamic"`
- **useSearchParams**: Must wrap in Suspense boundary

## Build & Test
```bash
npm run build     # Full production build
npm run lint      # ESLint
npm run typecheck # TypeScript checking
npm run dev       # Development server
```
