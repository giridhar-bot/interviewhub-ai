-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('USER', 'PREMIUM', 'AUTHOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('THEORY', 'CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'HR');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT', 'MEMORY_LIMIT', 'RUNTIME_ERROR', 'COMPILE_ERROR', 'PENDING');

-- CreateEnum
CREATE TYPE "InterviewResult" AS ENUM ('SELECTED', 'REJECTED', 'IN_PROGRESS', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'COMMENT', 'VOTE', 'ACHIEVEMENT', 'FOLLOW', 'MENTION', 'STREAK');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'INAPPROPRIATE', 'HARASSMENT', 'COPYRIGHT', 'OTHER');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ROLE_CHANGE', 'BAN', 'UNBAN');

-- CreateEnum
CREATE TYPE "TechnologyStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TopicDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP', 'MID_SIZE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "InterviewRoundType" AS ENUM ('ONLINE_ASSESSMENT', 'TECHNICAL', 'MACHINE_CODING', 'SYSTEM_DESIGN', 'MANAGERIAL', 'HR');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('INTERN', 'FULL_TIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('JAVA', 'JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'CPP', 'CSHARP', 'GO');

-- CreateEnum
CREATE TYPE "QuizQuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK');

-- CreateEnum
CREATE TYPE "AIConversationType" AS ENUM ('DOUBT_SOLVER', 'MOCK_INTERVIEW', 'RESUME_REVIEW', 'HR_COACH', 'SYSTEM_DESIGN');

-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('RESUME_DRAFT', 'RESUME_PUBLISHED', 'RESUME_ARCHIVED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('PLAN_FREE', 'PLAN_PRO', 'PLAN_ENTERPRISE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAYMENT_PENDING', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'PAYMENT_REFUNDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "displayName" TEXT,
    "name" TEXT,
    "image" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "role" "RoleType" NOT NULL DEFAULT 'USER',
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "github" TEXT,
    "linkedin" TEXT,
    "website" TEXT,
    "timezone" TEXT DEFAULT 'UTC',
    "locale" TEXT DEFAULT 'en',
    "lastActiveAt" TIMESTAMP(3),
    "bannedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" "RoleType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "color" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "TechnologyStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "category" TEXT NOT NULL,
    "technologyId" TEXT,
    "parentTopicId" TEXT,
    "difficulty" "TopicDifficulty",
    "estimatedHours" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "topicId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "shortDescription" TEXT,
    "coverImage" TEXT,
    "topicId" TEXT NOT NULL,
    "subTopicId" TEXT,
    "authorId" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "version" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT[],
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_versions" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "articleId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("articleId","tagId")
);

-- CreateTable
CREATE TABLE "seo_metadata" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "canonicalUrl" TEXT,
    "ogImage" TEXT,
    "robots" TEXT DEFAULT 'index,follow',
    "schemaMarkup" JSONB,

    CONSTRAINT "seo_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_faqs" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "article_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_examples" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "code_examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "related_articles" (
    "sourceArticleId" TEXT NOT NULL,
    "targetArticleId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,

    CONSTRAINT "related_articles_pkey" PRIMARY KEY ("sourceArticleId","targetArticleId")
);

-- CreateTable
CREATE TABLE "reading_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reading_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_analytics" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "bookmarks" INTEGER NOT NULL DEFAULT 0,
    "averageReadTime" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "article_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmaps" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "topicId" TEXT NOT NULL,
    "technologyId" TEXT,
    "estimatedHours" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_steps" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "topicId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "resources" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmap_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cheat_sheets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cheat_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_decks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "topicId" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "cardCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashcard_decks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcards" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flashcards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flashcard_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3),
    "lastReviewedAt" TIMESTAMP(3),

    CONSTRAINT "flashcard_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_resources" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT,

    CONSTRAINT "learning_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "topicId" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "timeLimit" INTEGER,
    "durationMin" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "explanation" TEXT,
    "type" "QuizQuestionType" NOT NULL DEFAULT 'SINGLE_CHOICE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL DEFAULT 0,
    "answers" JSONB NOT NULL,
    "timeTaken" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedValue" TEXT,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT,
    "topicIds" TEXT[],
    "scheduledAt" TIMESTAMP(3),
    "cardsReviewed" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revision_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievement" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "achievement_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "headquarters" TEXT,
    "employeeCount" TEXT,
    "size" "CompanySize",
    "isHiring" BOOLEAN NOT NULL DEFAULT true,
    "interviewProcess" TEXT,
    "avgSalary" JSONB,
    "techStack" TEXT[],
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_roles" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT,
    "level" TEXT,
    "experienceMin" INTEGER,
    "experienceMax" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_rounds" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InterviewRoundType",
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "duration" INTEGER,
    "tips" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_questions" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "roundId" TEXT NOT NULL,
    "topicId" TEXT,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "type" "QuestionType" NOT NULL DEFAULT 'THEORY',
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "lastAskedAt" TIMESTAMP(3),
    "isMostAsked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "topicId" TEXT NOT NULL,
    "companyId" TEXT,
    "type" "QuestionType" NOT NULL DEFAULT 'THEORY',
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_experiences" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT,
    "companyId" TEXT NOT NULL,
    "roleId" TEXT,
    "role" TEXT NOT NULL,
    "result" "InterviewResult" NOT NULL,
    "rounds" INTEGER NOT NULL,
    "yoe" INTEGER,
    "overallRating" INTEGER,
    "difficulty" "Difficulty",
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "selected" BOOLEAN,
    "offerReceived" BOOLEAN,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_votes" (
    "experienceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL,

    CONSTRAINT "experience_votes_pkey" PRIMARY KEY ("experienceId","userId")
);

-- CreateTable
CREATE TABLE "salary_insights" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "roleId" TEXT,
    "userId" TEXT,
    "role" TEXT NOT NULL,
    "level" TEXT,
    "employmentType" "EmploymentType",
    "experienceYears" DOUBLE PRECISION,
    "baseSalary" DOUBLE PRECISION,
    "totalComp" DOUBLE PRECISION,
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "location" TEXT,
    "yoe" INTEGER,
    "source" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preparation_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "companyId" TEXT,
    "roleId" TEXT,
    "targetRole" TEXT,
    "title" TEXT,
    "description" TEXT,
    "durationWeeks" INTEGER NOT NULL DEFAULT 4,
    "durationDays" INTEGER,
    "plan" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preparation_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preparation_tasks" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "preparation_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_processes" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "roleId" TEXT,
    "totalRounds" INTEGER NOT NULL,
    "estimatedDays" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "company_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_tag_maps" (
    "companyId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "company_tag_maps_pkey" PRIMARY KEY ("companyId","tagId")
);

-- CreateTable
CREATE TABLE "company_analytics" (
    "companyId" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "interviewCount" INTEGER NOT NULL DEFAULT 0,
    "avgDifficulty" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "company_analytics_pkey" PRIMARY KEY ("companyId")
);

-- CreateTable
CREATE TABLE "hiring_trends" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "openings" INTEGER NOT NULL,
    "trendScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "hiring_trends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_problems" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT NOT NULL,
    "constraints" TEXT,
    "examples" JSONB NOT NULL,
    "solution" TEXT,
    "hints" TEXT[],
    "tags" TEXT[],
    "acceptance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coding_problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_tags" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "problem_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_companies" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "lastAsked" TIMESTAMP(3),

    CONSTRAINT "problem_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_cases" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hidden_test_cases" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hidden_test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "version" TEXT,
    "compileCmd" TEXT,
    "runCmd" TEXT,
    "template" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "runtime" INTEGER,
    "memory" INTEGER,
    "testsPassed" INTEGER,
    "testsTotal" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_problems" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "contest_problems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_submissions" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL,
    "runtime" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contest_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboards" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "solvedCount" INTEGER NOT NULL DEFAULT 0,
    "penalty" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contest_participants" (
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,

    CONSTRAINT "contest_participants_pkey" PRIMARY KEY ("contestId","userId")
);

-- CreateTable
CREATE TABLE "ai_tutor_conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "topicId" TEXT,
    "type" "AIConversationType" NOT NULL DEFAULT 'DOUBT_SOLVER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_tutor_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "tokenCount" INTEGER,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mock_interviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "companyId" TEXT,
    "role" TEXT,
    "duration" INTEGER,
    "score" INTEGER,
    "feedback" JSONB,
    "transcript" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mock_interviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_questions_ai" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "userAnswer" TEXT,
    "idealAnswer" TEXT,
    "score" INTEGER,
    "feedback" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_questions_ai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_feedbacks" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "atsScore" INTEGER,
    "feedback" JSONB,
    "suggestions" JSONB,
    "parsedData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ats_scores" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "suggestions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ats_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT,
    "type" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reason" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "targetRole" TEXT,
    "targetCompany" TEXT,
    "timeline" INTEGER,
    "plan" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "theme" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_interview_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    "score" DOUBLE PRECISION,
    "transcript" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hr_interview_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_analytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interviewsTaken" INTEGER NOT NULL DEFAULT 0,
    "avgScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "strongestTopic" TEXT,
    "weakestTopic" TEXT,

    CONSTRAINT "interview_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL,
    "model" TEXT NOT NULL,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_recommendation_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_recommendation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_group_members" (
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "study_group_members_pkey" PRIMARY KEY ("groupId","userId")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "template" TEXT NOT NULL DEFAULT 'modern',
    "summary" TEXT,
    "atsScore" DOUBLE PRECISION,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_versions" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ats_reports" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "keywordScore" DOUBLE PRECISION NOT NULL,
    "formattingScore" DOUBLE PRECISION NOT NULL,
    "suggestions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ats_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "techStack" TEXT[],
    "url" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experiences" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "highlights" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "work_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educations" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT,
    "grade" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "url" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_achievements" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "resume_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postId" TEXT,
    "articleId" TEXT,
    "parentId" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "postId" TEXT,
    "commentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_items" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "completion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalStudyMins" INTEGER NOT NULL DEFAULT 0,
    "articlesRead" INTEGER NOT NULL DEFAULT 0,
    "quizzesTaken" INTEGER NOT NULL DEFAULT 0,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmap_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "bestScore" INTEGER NOT NULL DEFAULT 0,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttempt" TIMESTAMP(3),

    CONSTRAINT "quiz_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "bestRuntime" INTEGER,
    "bestMemory" INTEGER,
    "firstSolvedAt" TIMESTAMP(3),

    CONSTRAINT "coding_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "targetXP" INTEGER NOT NULL DEFAULT 50,
    "earnedXP" INTEGER NOT NULL DEFAULT 0,
    "articlesGoal" INTEGER NOT NULL DEFAULT 2,
    "articlesRead" INTEGER NOT NULL DEFAULT 0,
    "problemsGoal" INTEGER NOT NULL DEFAULT 1,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "targetXP" INTEGER NOT NULL DEFAULT 350,
    "earnedXP" INTEGER NOT NULL DEFAULT 0,
    "topicsGoal" INTEGER NOT NULL DEFAULT 3,
    "topicsStudied" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "length" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveOn" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "lastSearched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trending_searches" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trending_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_analytics" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "clickedId" TEXT,
    "clickedType" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slug_history" (
    "id" TEXT NOT NULL,
    "oldSlug" TEXT NOT NULL,
    "newSlug" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slug_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_data" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT[],
    "ogImage" TEXT,
    "canonical" TEXT,
    "noIndex" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "meta_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redirects" (
    "id" TEXT NOT NULL,
    "fromPath" TEXT NOT NULL,
    "toPath" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 301,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_markups" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "schema_markups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldData" JSONB,
    "newData" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "rules" JSONB,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "targetId" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_queue" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "assignedTo" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "device" TEXT,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "properties" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_analytics" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "pageCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,

    CONSTRAINT "session_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_analytics" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "avgDuration" INTEGER,
    "bounceRate" DOUBLE PRECISION,
    "shares" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "content_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL,
    "provider" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountPct" DOUBLE PRECISION NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_settings" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_analytics" (
    "id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "metricValue" DOUBLE PRECISION NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_name_key" ON "technologies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_slug_key" ON "technologies"("slug");

-- CreateIndex
CREATE INDEX "technologies_slug_idx" ON "technologies"("slug");

-- CreateIndex
CREATE INDEX "technologies_status_idx" ON "technologies"("status");

-- CreateIndex
CREATE UNIQUE INDEX "topics_name_key" ON "topics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "topics_slug_key" ON "topics"("slug");

-- CreateIndex
CREATE INDEX "topics_slug_idx" ON "topics"("slug");

-- CreateIndex
CREATE INDEX "topics_category_idx" ON "topics"("category");

-- CreateIndex
CREATE INDEX "topics_technologyId_idx" ON "topics"("technologyId");

-- CreateIndex
CREATE UNIQUE INDEX "sub_topics_slug_key" ON "sub_topics"("slug");

-- CreateIndex
CREATE INDEX "sub_topics_topicId_idx" ON "sub_topics"("topicId");

-- CreateIndex
CREATE INDEX "sub_topics_slug_idx" ON "sub_topics"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_topicId_idx" ON "articles"("topicId");

-- CreateIndex
CREATE INDEX "articles_subTopicId_idx" ON "articles"("subTopicId");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_publishedAt_idx" ON "articles"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "articles_tags_idx" ON "articles"("tags");

-- CreateIndex
CREATE UNIQUE INDEX "article_versions_articleId_version_key" ON "article_versions"("articleId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "seo_metadata_articleId_key" ON "seo_metadata"("articleId");

-- CreateIndex
CREATE INDEX "article_faqs_articleId_idx" ON "article_faqs"("articleId");

-- CreateIndex
CREATE INDEX "code_examples_articleId_idx" ON "code_examples"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "reading_history_userId_articleId_key" ON "reading_history"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "article_analytics_articleId_key" ON "article_analytics"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmaps_slug_key" ON "roadmaps"("slug");

-- CreateIndex
CREATE INDEX "roadmaps_slug_idx" ON "roadmaps"("slug");

-- CreateIndex
CREATE INDEX "roadmaps_technologyId_idx" ON "roadmaps"("technologyId");

-- CreateIndex
CREATE INDEX "roadmap_steps_roadmapId_order_idx" ON "roadmap_steps"("roadmapId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_steps_roadmapId_order_key" ON "roadmap_steps"("roadmapId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "cheat_sheets_slug_key" ON "cheat_sheets"("slug");

-- CreateIndex
CREATE INDEX "cheat_sheets_slug_idx" ON "cheat_sheets"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_decks_slug_key" ON "flashcard_decks"("slug");

-- CreateIndex
CREATE INDEX "flashcard_decks_topicId_idx" ON "flashcard_decks"("topicId");

-- CreateIndex
CREATE INDEX "flashcards_deckId_idx" ON "flashcards"("deckId");

-- CreateIndex
CREATE UNIQUE INDEX "flashcard_progress_userId_flashcardId_key" ON "flashcard_progress"("userId", "flashcardId");

-- CreateIndex
CREATE INDEX "learning_resources_topicId_idx" ON "learning_resources"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_slug_key" ON "quizzes"("slug");

-- CreateIndex
CREATE INDEX "quizzes_topicId_idx" ON "quizzes"("topicId");

-- CreateIndex
CREATE INDEX "quiz_questions_quizId_idx" ON "quiz_questions"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_questions_quizId_order_key" ON "quiz_questions"("quizId", "order");

-- CreateIndex
CREATE INDEX "quiz_options_questionId_idx" ON "quiz_options"("questionId");

-- CreateIndex
CREATE INDEX "quiz_attempts_userId_quizId_idx" ON "quiz_attempts"("userId", "quizId");

-- CreateIndex
CREATE INDEX "revision_sessions_userId_idx" ON "revision_sessions"("userId");

-- CreateIndex
CREATE INDEX "achievement_progress_userId_idx" ON "achievement_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_slug_idx" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_industry_idx" ON "companies"("industry");

-- CreateIndex
CREATE INDEX "company_roles_companyId_idx" ON "company_roles"("companyId");

-- CreateIndex
CREATE INDEX "interview_rounds_companyId_order_idx" ON "interview_rounds"("companyId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "interview_rounds_companyId_order_key" ON "interview_rounds"("companyId", "order");

-- CreateIndex
CREATE INDEX "interview_questions_roundId_idx" ON "interview_questions"("roundId");

-- CreateIndex
CREATE INDEX "interview_questions_companyId_idx" ON "interview_questions"("companyId");

-- CreateIndex
CREATE INDEX "interview_questions_difficulty_idx" ON "interview_questions"("difficulty");

-- CreateIndex
CREATE INDEX "interview_questions_frequency_idx" ON "interview_questions"("frequency");

-- CreateIndex
CREATE UNIQUE INDEX "questions_slug_key" ON "questions"("slug");

-- CreateIndex
CREATE INDEX "questions_topicId_idx" ON "questions"("topicId");

-- CreateIndex
CREATE INDEX "questions_companyId_idx" ON "questions"("companyId");

-- CreateIndex
CREATE INDEX "questions_difficulty_idx" ON "questions"("difficulty");

-- CreateIndex
CREATE INDEX "questions_companyId_difficulty_idx" ON "questions"("companyId", "difficulty");

-- CreateIndex
CREATE INDEX "questions_topicId_status_idx" ON "questions"("topicId", "status");

-- CreateIndex
CREATE INDEX "interview_experiences_companyId_idx" ON "interview_experiences"("companyId");

-- CreateIndex
CREATE INDEX "interview_experiences_authorId_idx" ON "interview_experiences"("authorId");

-- CreateIndex
CREATE INDEX "salary_insights_companyId_idx" ON "salary_insights"("companyId");

-- CreateIndex
CREATE INDEX "preparation_plans_userId_idx" ON "preparation_plans"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "preparation_tasks_planId_dayNumber_key" ON "preparation_tasks"("planId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "company_tags_name_key" ON "company_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "company_tags_slug_key" ON "company_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "hiring_trends_companyId_month_key" ON "hiring_trends"("companyId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "coding_problems_slug_key" ON "coding_problems"("slug");

-- CreateIndex
CREATE INDEX "coding_problems_difficulty_idx" ON "coding_problems"("difficulty");

-- CreateIndex
CREATE INDEX "coding_problems_category_idx" ON "coding_problems"("category");

-- CreateIndex
CREATE INDEX "coding_problems_slug_idx" ON "coding_problems"("slug");

-- CreateIndex
CREATE INDEX "problem_tags_tag_idx" ON "problem_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "problem_tags_problemId_tag_key" ON "problem_tags"("problemId", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "problem_companies_problemId_companyId_key" ON "problem_companies"("problemId", "companyId");

-- CreateIndex
CREATE INDEX "test_cases_problemId_idx" ON "test_cases"("problemId");

-- CreateIndex
CREATE INDEX "hidden_test_cases_problemId_idx" ON "hidden_test_cases"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "languages_slug_key" ON "languages"("slug");

-- CreateIndex
CREATE INDEX "submissions_userId_problemId_idx" ON "submissions"("userId", "problemId");

-- CreateIndex
CREATE INDEX "submissions_userId_createdAt_idx" ON "submissions"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "contests_slug_key" ON "contests"("slug");

-- CreateIndex
CREATE INDEX "contests_startTime_idx" ON "contests"("startTime");

-- CreateIndex
CREATE UNIQUE INDEX "contest_problems_contestId_problemId_key" ON "contest_problems"("contestId", "problemId");

-- CreateIndex
CREATE INDEX "contest_submissions_contestId_userId_idx" ON "contest_submissions"("contestId", "userId");

-- CreateIndex
CREATE INDEX "leaderboards_contestId_rank_idx" ON "leaderboards"("contestId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_contestId_userId_key" ON "leaderboards"("contestId", "userId");

-- CreateIndex
CREATE INDEX "ai_tutor_conversations_userId_idx" ON "ai_tutor_conversations"("userId");

-- CreateIndex
CREATE INDEX "ai_messages_conversationId_idx" ON "ai_messages"("conversationId");

-- CreateIndex
CREATE INDEX "mock_interviews_userId_idx" ON "mock_interviews"("userId");

-- CreateIndex
CREATE INDEX "interview_questions_ai_interviewId_idx" ON "interview_questions_ai"("interviewId");

-- CreateIndex
CREATE INDEX "interview_feedbacks_interviewId_idx" ON "interview_feedbacks"("interviewId");

-- CreateIndex
CREATE INDEX "resume_reviews_userId_idx" ON "resume_reviews"("userId");

-- CreateIndex
CREATE INDEX "ats_scores_reviewId_idx" ON "ats_scores"("reviewId");

-- CreateIndex
CREATE INDEX "learning_recommendations_userId_seen_idx" ON "learning_recommendations"("userId", "seen");

-- CreateIndex
CREATE INDEX "study_plans_userId_idx" ON "study_plans"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolios_slug_key" ON "portfolios"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "interview_analytics_userId_key" ON "interview_analytics"("userId");

-- CreateIndex
CREATE INDEX "resumes_userId_idx" ON "resumes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "resume_versions_resumeId_version_key" ON "resume_versions"("resumeId", "version");

-- CreateIndex
CREATE INDEX "ats_reports_resumeId_idx" ON "ats_reports"("resumeId");

-- CreateIndex
CREATE INDEX "skills_resumeId_idx" ON "skills"("resumeId");

-- CreateIndex
CREATE INDEX "projects_resumeId_idx" ON "projects"("resumeId");

-- CreateIndex
CREATE INDEX "work_experiences_resumeId_idx" ON "work_experiences"("resumeId");

-- CreateIndex
CREATE INDEX "educations_resumeId_idx" ON "educations"("resumeId");

-- CreateIndex
CREATE INDEX "certifications_resumeId_idx" ON "certifications"("resumeId");

-- CreateIndex
CREATE INDEX "resume_achievements_resumeId_idx" ON "resume_achievements"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "posts_slug_idx" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- CreateIndex
CREATE INDEX "posts_tags_idx" ON "posts"("tags");

-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "comments"("postId");

-- CreateIndex
CREATE INDEX "comments_articleId_idx" ON "comments"("articleId");

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_postId_key" ON "votes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "votes_userId_commentId_key" ON "votes"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_entityType_entityId_key" ON "bookmarks"("userId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "collections_userId_idx" ON "collections"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_items_collectionId_entityType_entityId_key" ON "collection_items"("collectionId", "entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "follows"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_userId_entityType_entityId_key" ON "user_progress"("userId", "entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "learning_progress_userId_topicId_key" ON "learning_progress"("userId", "topicId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_progress_userId_roadmapId_key" ON "roadmap_progress"("userId", "roadmapId");

-- CreateIndex
CREATE UNIQUE INDEX "article_progress_userId_articleId_key" ON "article_progress"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_progress_userId_quizId_key" ON "quiz_progress"("userId", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "coding_progress_userId_problemId_key" ON "coding_progress"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_goals_userId_date_key" ON "daily_goals"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_goals_userId_weekStart_key" ON "weekly_goals"("userId", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "badges_slug_key" ON "badges"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_name_key" ON "achievements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_slug_key" ON "achievements"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "xp_history_userId_createdAt_idx" ON "xp_history"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "learning_streaks_userId_active_idx" ON "learning_streaks"("userId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "search_keywords_keyword_key" ON "search_keywords"("keyword");

-- CreateIndex
CREATE INDEX "search_keywords_count_idx" ON "search_keywords"("count");

-- CreateIndex
CREATE INDEX "trending_searches_date_count_idx" ON "trending_searches"("date", "count");

-- CreateIndex
CREATE UNIQUE INDEX "trending_searches_keyword_date_key" ON "trending_searches"("keyword", "date");

-- CreateIndex
CREATE INDEX "search_analytics_createdAt_idx" ON "search_analytics"("createdAt");

-- CreateIndex
CREATE INDEX "slug_history_oldSlug_idx" ON "slug_history"("oldSlug");

-- CreateIndex
CREATE UNIQUE INDEX "meta_data_entityType_entityId_key" ON "meta_data"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "redirects_fromPath_key" ON "redirects"("fromPath");

-- CreateIndex
CREATE UNIQUE INDEX "schema_markups_entityType_entityId_key" ON "schema_markups"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_name_key" ON "feature_flags"("name");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_entityType_entityId_idx" ON "reports"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "moderation_queue_resolvedAt_idx" ON "moderation_queue"("resolvedAt");

-- CreateIndex
CREATE INDEX "moderation_queue_priority_idx" ON "moderation_queue"("priority");

-- CreateIndex
CREATE INDEX "page_views_path_idx" ON "page_views"("path");

-- CreateIndex
CREATE INDEX "page_views_userId_idx" ON "page_views"("userId");

-- CreateIndex
CREATE INDEX "page_views_createdAt_idx" ON "page_views"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_name_idx" ON "analytics_events"("name");

-- CreateIndex
CREATE INDEX "analytics_events_userId_idx" ON "analytics_events"("userId");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_analytics_sessionId_key" ON "session_analytics"("sessionId");

-- CreateIndex
CREATE INDEX "session_analytics_userId_idx" ON "session_analytics"("userId");

-- CreateIndex
CREATE INDEX "session_analytics_startedAt_idx" ON "session_analytics"("startedAt");

-- CreateIndex
CREATE INDEX "content_analytics_date_idx" ON "content_analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "content_analytics_entityType_entityId_date_key" ON "content_analytics"("entityType", "entityId", "date");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_name_key" ON "notification_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "admin_settings_category_key_key" ON "admin_settings"("category", "key");

-- CreateIndex
CREATE INDEX "platform_analytics_metric_idx" ON "platform_analytics"("metric");

-- CreateIndex
CREATE INDEX "audit_events_createdAt_idx" ON "audit_events"("createdAt");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_parentTopicId_fkey" FOREIGN KEY ("parentTopicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_topics" ADD CONSTRAINT "sub_topics_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_subTopicId_fkey" FOREIGN KEY ("subTopicId") REFERENCES "sub_topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_faqs" ADD CONSTRAINT "article_faqs_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_examples" ADD CONSTRAINT "code_examples_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_articles" ADD CONSTRAINT "related_articles_sourceArticleId_fkey" FOREIGN KEY ("sourceArticleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "related_articles" ADD CONSTRAINT "related_articles_targetArticleId_fkey" FOREIGN KEY ("targetArticleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reading_history" ADD CONSTRAINT "reading_history_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_analytics" ADD CONSTRAINT "article_analytics_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_steps" ADD CONSTRAINT "roadmap_steps_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_steps" ADD CONSTRAINT "roadmap_steps_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cheat_sheets" ADD CONSTRAINT "cheat_sheets_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_decks" ADD CONSTRAINT "flashcard_decks_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "flashcard_decks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flashcard_progress" ADD CONSTRAINT "flashcard_progress_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "flashcards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_resources" ADD CONSTRAINT "learning_resources_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_sessions" ADD CONSTRAINT "revision_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_sessions" ADD CONSTRAINT "revision_sessions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "achievement_progress" ADD CONSTRAINT "achievement_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_roles" ADD CONSTRAINT "company_roles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_rounds" ADD CONSTRAINT "interview_rounds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "interview_rounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_experiences" ADD CONSTRAINT "interview_experiences_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_experiences" ADD CONSTRAINT "interview_experiences_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_experiences" ADD CONSTRAINT "interview_experiences_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "company_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_votes" ADD CONSTRAINT "experience_votes_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "interview_experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_votes" ADD CONSTRAINT "experience_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_insights" ADD CONSTRAINT "salary_insights_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_insights" ADD CONSTRAINT "salary_insights_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "company_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_insights" ADD CONSTRAINT "salary_insights_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preparation_plans" ADD CONSTRAINT "preparation_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preparation_plans" ADD CONSTRAINT "preparation_plans_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preparation_plans" ADD CONSTRAINT "preparation_plans_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "company_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preparation_tasks" ADD CONSTRAINT "preparation_tasks_planId_fkey" FOREIGN KEY ("planId") REFERENCES "preparation_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_processes" ADD CONSTRAINT "interview_processes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_processes" ADD CONSTRAINT "interview_processes_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "company_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_tag_maps" ADD CONSTRAINT "company_tag_maps_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_tag_maps" ADD CONSTRAINT "company_tag_maps_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "company_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_analytics" ADD CONSTRAINT "company_analytics_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hiring_trends" ADD CONSTRAINT "hiring_trends_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_tags" ADD CONSTRAINT "problem_tags_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_companies" ADD CONSTRAINT "problem_companies_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_companies" ADD CONSTRAINT "problem_companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hidden_test_cases" ADD CONSTRAINT "hidden_test_cases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "coding_problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "coding_problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "coding_problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_submissions" ADD CONSTRAINT "contest_submissions_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_submissions" ADD CONSTRAINT "contest_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_participants" ADD CONSTRAINT "contest_participants_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contest_participants" ADD CONSTRAINT "contest_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tutor_conversations" ADD CONSTRAINT "ai_tutor_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_tutor_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_interviews" ADD CONSTRAINT "mock_interviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_interviews" ADD CONSTRAINT "mock_interviews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_questions_ai" ADD CONSTRAINT "interview_questions_ai_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "mock_interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_feedbacks" ADD CONSTRAINT "interview_feedbacks_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "mock_interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_reviews" ADD CONSTRAINT "resume_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ats_scores" ADD CONSTRAINT "ats_scores_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "resume_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_recommendations" ADD CONSTRAINT "learning_recommendations_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_interview_sessions" ADD CONSTRAINT "hr_interview_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_interview_sessions" ADD CONSTRAINT "hr_interview_sessions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_analytics" ADD CONSTRAINT "interview_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage_history" ADD CONSTRAINT "ai_usage_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_recommendation_history" ADD CONSTRAINT "ai_recommendation_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ats_reports" ADD CONSTRAINT "ats_reports_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_achievements" ADD CONSTRAINT "resume_achievements_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_progress" ADD CONSTRAINT "roadmap_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_progress" ADD CONSTRAINT "roadmap_progress_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_progress" ADD CONSTRAINT "article_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_progress" ADD CONSTRAINT "article_progress_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_progress" ADD CONSTRAINT "quiz_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coding_progress" ADD CONSTRAINT "coding_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_goals" ADD CONSTRAINT "daily_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_goals" ADD CONSTRAINT "weekly_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_history" ADD CONSTRAINT "xp_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_streaks" ADD CONSTRAINT "learning_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
