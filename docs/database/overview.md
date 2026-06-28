# InterviewHub AI — Database Documentation

## Provider
PostgreSQL 16 (Neon for production)

## ORM
Prisma 7 with `@prisma/adapter-pg`

## Schema Domains
1. Identity (User, Account, Session, Roles)
2. Learning (Topics, Articles, Roadmaps, Flashcards, Quizzes)
3. Company (Companies, Roles, Interview Questions, Experiences)
4. Coding (Problems, Test Cases, Submissions, Contests)
5. AI (Conversations, Mock Interviews, Resume Reviews)
6. Resume (Resumes, Skills, Projects, ATS Reports)
7. Community (Posts, Comments, Votes, Tags)
8. Progress (XP, Badges, Achievements, Streaks)
9. Admin (Audit Logs, Feature Flags, Analytics)
10. Subscription (Plans, Payments, Coupons)

## Migrations
```bash
npx prisma migrate dev --name <description>
npx prisma migrate deploy  # production
```
