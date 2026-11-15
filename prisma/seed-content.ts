import "dotenv/config";
import { createHash } from "node:crypto";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";
import { databaseConfig } from "../src/config/database";
import { topicsSeed } from "./seeds/topics";
import { resumeTemplateCatalog } from "./seeds/content/resume-templates";
import {
  contentSlug,
  validateContent,
  validatePracticeSolutions,
  validateMarkdownContent,
  withReferences,
} from "./seeds/content/validation";
import type { CaseStudyContent, CodingContent, TopicContent } from "./seeds/content/types";

const options = z
  .object({
    apply: z.boolean(),
    inventory: z.boolean(),
    expectedHost: z.string().optional(),
  })
  .refine((value) => !(value.apply && value.inventory), {
    message: "Choose inventory or publication, not both.",
  });

const args = process.argv.slice(2);
const hostIndex = args.indexOf("--expect-host");
const parsedOptions = options.parse({
  apply: args.includes("--apply"),
  inventory: args.includes("--inventory"),
  expectedHost: hostIndex >= 0 ? args[hostIndex + 1] : undefined,
});
const recognized = new Set(["--apply", "--inventory", "--expect-host"]);
args.forEach((arg, index) => {
  if (!recognized.has(arg) && !(hostIndex >= 0 && index === hostIndex + 1))
    throw new Error(`Unknown argument: ${arg}`);
});

const databaseUrl = z.url().parse(databaseConfig.url);
const hostname = new URL(databaseUrl).hostname;
if (
  parsedOptions.apply &&
  (!parsedOptions.expectedHost || parsedOptions.expectedHost !== hostname)
) {
  throw new Error(
    "Publishing requires --apply --expect-host with the exact intended database hostname."
  );
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
type Counts = Record<
  | "questions"
  | "articles"
  | "roadmaps"
  | "cheatSheets"
  | "decks"
  | "quizzes"
  | "resources"
  | "problems"
  | "templates",
  number
>;
const emptyCounts = (): Counts => ({
  questions: 0,
  articles: 0,
  roadmaps: 0,
  cheatSheets: 0,
  decks: 0,
  quizzes: 0,
  resources: 0,
  problems: 0,
  templates: 0,
});

async function protectedContentSignature() {
  const where = { slug: { not: { startsWith: "ih-" } } };
  const orderBy = { id: "asc" as const };
  const rows = await Promise.all([
    prisma.question.findMany({
      where,
      orderBy,
      select: { id: true, title: true, content: true, answer: true, topicId: true, status: true },
    }),
    prisma.article.findMany({
      where,
      orderBy,
      select: { id: true, title: true, content: true, excerpt: true, topicId: true, status: true },
    }),
    prisma.roadmap.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        description: true,
        topicId: true,
        isPublished: true,
        steps: {
          orderBy: { order: "asc" },
          select: { title: true, description: true, order: true, resources: true },
        },
      },
    }),
    prisma.cheatSheet.findMany({
      where,
      orderBy,
      select: { id: true, title: true, content: true, topicId: true, status: true },
    }),
    prisma.flashcardDeck.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        topicId: true,
        status: true,
        flashcards: {
          orderBy: [{ order: "asc" }, { id: "asc" }],
          select: { front: true, back: true, order: true },
        },
      },
    }),
    prisma.quiz.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        topicId: true,
        status: true,
        questions: {
          orderBy: { order: "asc" },
          select: {
            question: true,
            explanation: true,
            options: { orderBy: { order: "asc" }, select: { text: true, isCorrect: true } },
          },
        },
      },
    }),
  ]);
  return {
    count: rows.reduce((sum, table) => sum + table.length, 0),
    hash: createHash("sha256").update(JSON.stringify(rows)).digest("hex"),
  };
}

async function inventory() {
  const topics = await prisma.topic.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      _count: {
        select: {
          questions: { where: { status: "PUBLISHED", deletedAt: null } },
          articles: { where: { status: "PUBLISHED", deletedAt: null } },
          roadmaps: { where: { status: "PUBLISHED", isPublished: true, deletedAt: null } },
          cheatSheets: { where: { status: "PUBLISHED", deletedAt: null } },
          flashcardDecks: { where: { status: "PUBLISHED" } },
          quizzes: { where: { status: "PUBLISHED", isPublished: true } },
        },
      },
    },
  });
  console.info(
    JSON.stringify({
      databaseHost: hostname,
      coverage: topics.map(({ slug, _count }) => ({ slug, ..._count })),
    })
  );
  return topics;
}

async function transaction<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await prisma.$transaction(operation, {
        isolationLevel: "Serializable",
        maxWait: 10000,
        timeout: 60000,
      });
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== "P2034" ||
        attempt === 3
      )
        throw error;
      console.warn(`Retrying a concurrent content transaction (${attempt}/3).`);
    }
  }
  throw new Error("Content transaction retries exhausted.");
}

async function publishTopic(topicId: string, content: TopicContent): Promise<Counts> {
  const definition = topicsSeed.find((topic) => topic.slug === content.slug);
  if (!definition) throw new Error(`Missing topic definition: ${content.slug}`);
  return transaction(async (tx) => {
    const created = emptyCounts();
    const questionData = content.questions.map((question) => ({
      slug: contentSlug(content.slug, question.key),
      title: question.title,
      content: question.prompt,
      answer: withReferences(question.answer, content.references),
      difficulty: question.difficulty,
      tags: question.tags,
      type:
        content.slug === "behavioral-interview"
          ? ("BEHAVIORAL" as const)
          : content.slug === "hr-interview"
            ? ("HR" as const)
            : content.slug === "system-design" || content.slug === "low-level-design"
              ? ("SYSTEM_DESIGN" as const)
              : ("THEORY" as const),
      topicId,
      status: "PUBLISHED" as const,
    }));
    created.questions = (
      await tx.question.createMany({ data: questionData, skipDuplicates: true })
    ).count;
    created.articles = (
      await tx.article.createMany({
        data: content.notes.map((note) => ({
          slug: contentSlug(content.slug, note.key),
          title: note.title,
          content: withReferences(note.content, content.references),
          excerpt: note.excerpt,
          topicId,
          tags: [content.slug, "interviewhub-original"],
          readTime: Math.max(1, Math.ceil(note.content.split(/\s+/).length / 200)),
          status: "PUBLISHED",
          publishedAt: new Date(),
        })),
        skipDuplicates: true,
      })
    ).count;
    const roadmapSlug = contentSlug(content.slug, "preparation-roadmap");
    if (!(await tx.roadmap.findUnique({ where: { slug: roadmapSlug }, select: { id: true } }))) {
      await tx.roadmap.create({
        data: {
          slug: roadmapSlug,
          topicId,
          title: content.roadmap.title,
          description: content.roadmap.description,
          estimatedHours: content.roadmap.estimatedHours,
          status: "PUBLISHED",
          isPublished: true,
          steps: {
            create: content.roadmap.steps.map((step, index) => ({
              title: step.title,
              description: `${step.description}\nSuggested study time: ${step.hours} hours.`,
              topicId,
              order: index + 1,
              resources: {
                links: content.notes.map((note) => ({
                  title: note.title,
                  url: `/learn/notes/${contentSlug(content.slug, note.key)}`,
                })),
              },
            })),
          },
        },
      });
      created.roadmaps = 1;
    }
    created.cheatSheets = (
      await tx.cheatSheet.createMany({
        data: [
          {
            slug: contentSlug(content.slug, "revision-cheat-sheet"),
            title: content.cheatSheet.title,
            content: withReferences(content.cheatSheet.content, content.references),
            topicId,
            status: "PUBLISHED",
          },
        ],
        skipDuplicates: true,
      })
    ).count;
    const deckSlug = contentSlug(content.slug, "interview-flashcards");
    if (!(await tx.flashcardDeck.findUnique({ where: { slug: deckSlug }, select: { id: true } }))) {
      await tx.flashcardDeck.create({
        data: {
          slug: deckSlug,
          topicId,
          title: `${definition.name} Interview Flashcards`,
          description:
            "Original retrieval-practice cards covering the topic's interview question library.",
          cardCount: content.questions.length,
          status: "PUBLISHED",
          flashcards: {
            create: content.questions.map((question, index) => ({
              front: question.title,
              back: question.answer,
              order: index + 1,
              difficulty:
                question.difficulty === "EASY" ? 1 : question.difficulty === "MEDIUM" ? 2 : 3,
            })),
          },
        },
      });
      created.decks = 1;
    }
    const quizSlug = contentSlug(content.slug, "understanding-check");
    if (!(await tx.quiz.findUnique({ where: { slug: quizSlug }, select: { id: true } }))) {
      await tx.quiz.create({
        data: {
          slug: quizSlug,
          topicId,
          title: content.quiz.title,
          description: "Original single-choice assessment with explanations for every answer.",
          status: "PUBLISHED",
          isPublished: true,
          difficulty: "MEDIUM",
          timeLimit: 15,
          durationMin: 15,
          questions: {
            create: content.quiz.questions.map((question, index) => ({
              question: question.question,
              explanation: question.explanation,
              order: index + 1,
              type: "SINGLE_CHOICE",
              points: 1,
              options: {
                create: question.options.map((text, optionIndex) => ({
                  text,
                  order: optionIndex + 1,
                  isCorrect: optionIndex === question.correctIndex,
                })),
              },
            })),
          },
        },
      });
      created.quizzes = 1;
    }
    const existingReferences = await tx.learningResource.findMany({
      where: { topicId },
      select: { url: true },
    });
    const knownUrls = new Set(existingReferences.map((item) => item.url));
    const resources = content.references.filter((reference) => !knownUrls.has(reference.url));
    if (resources.length)
      created.resources = (
        await tx.learningResource.createMany({
          data: resources.map((reference) => ({
            ...reference,
            topicId,
            resourceType: "REFERENCE",
          })),
        })
      ).count;
    return created;
  });
}

async function publishProblem(problem: CodingContent) {
  return transaction(async (tx) => {
    const slug = contentSlug("coding", problem.key);
    if (await tx.codingProblem.findUnique({ where: { slug }, select: { id: true } })) return 0;
    await tx.codingProblem.create({
      data: {
        slug,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        category: problem.category,
        constraints: problem.constraints,
        examples: problem.examples,
        hints: problem.hints,
        tags: problem.tags,
        solution: `${problem.solution}\n\n\`\`\`javascript\n${problem.solutionCode}\n\`\`\`\n`,
        status: "PUBLISHED",
        problemTags: { create: problem.tags.map((tag) => ({ tag })) },
        testCases: {
          create: problem.testCases.map((testCase, index) => ({
            input: testCase.input,
            expected: testCase.expected,
            isHidden: testCase.hidden,
            order: index + 1,
          })),
        },
      },
    });
    return 1;
  });
}

async function publishCaseStudy(topicId: string, study: CaseStudyContent) {
  return (
    await prisma.article.createMany({
      data: [
        {
          slug: contentSlug("case-study", study.key),
          topicId,
          title: study.title,
          content: withReferences(study.content, study.references),
          excerpt: study.excerpt,
          tags: study.tags,
          status: "PUBLISHED",
          publishedAt: new Date(),
          readTime: Math.max(1, Math.ceil(study.content.split(/\s+/).length / 200)),
        },
      ],
      skipDuplicates: true,
    })
  ).count;
}

async function verifyPublished(
  topics: TopicContent[],
  problems: CodingContent[],
  cases: CaseStudyContent[]
) {
  const questionSlugs = topics.flatMap((topic) =>
    topic.questions.map((question) => contentSlug(topic.slug, question.key))
  );
  const articleSlugs = [
    ...topics.flatMap((topic) => topic.notes.map((note) => contentSlug(topic.slug, note.key))),
    ...cases.map((study) => contentSlug("case-study", study.key)),
  ];
  const actual = await Promise.all([
    prisma.question.count({
      where: { slug: { in: questionSlugs }, status: "PUBLISHED", deletedAt: null },
    }),
    prisma.article.count({
      where: { slug: { in: articleSlugs }, status: "PUBLISHED", deletedAt: null },
    }),
    prisma.roadmap.count({
      where: {
        slug: { in: topics.map((topic) => contentSlug(topic.slug, "preparation-roadmap")) },
        status: "PUBLISHED",
        isPublished: true,
        deletedAt: null,
      },
    }),
    prisma.cheatSheet.count({
      where: {
        slug: { in: topics.map((topic) => contentSlug(topic.slug, "revision-cheat-sheet")) },
        status: "PUBLISHED",
        deletedAt: null,
      },
    }),
    prisma.flashcardDeck.count({
      where: {
        slug: { in: topics.map((topic) => contentSlug(topic.slug, "interview-flashcards")) },
        status: "PUBLISHED",
        cardCount: 20,
      },
    }),
    prisma.quiz.count({
      where: {
        slug: { in: topics.map((topic) => contentSlug(topic.slug, "understanding-check")) },
        status: "PUBLISHED",
        isPublished: true,
      },
    }),
    prisma.codingProblem.count({
      where: {
        slug: { in: problems.map((problem) => contentSlug("coding", problem.key)) },
        status: "PUBLISHED",
        deletedAt: null,
      },
    }),
  ]);
  const expected = [
    questionSlugs.length,
    articleSlugs.length,
    topics.length,
    topics.length,
    topics.length,
    topics.length,
    problems.length,
  ];
  if (actual.some((value, index) => value !== expected[index])) {
    throw new Error(
      `Published content verification failed: expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}. Existing edited/archived records were not overwritten.`
    );
  }
  const [decks, quizzes, codingRows, roadmapRows] = await Promise.all([
    prisma.flashcardDeck.findMany({
      where: {
        slug: { in: topics.map((topic) => contentSlug(topic.slug, "interview-flashcards")) },
      },
      select: { slug: true, _count: { select: { flashcards: true } } },
    }),
    prisma.quiz.findMany({
      where: {
        slug: { in: topics.map((topic) => contentSlug(topic.slug, "understanding-check")) },
      },
      select: { slug: true, questions: { select: { options: { select: { isCorrect: true } } } } },
    }),
    prisma.codingProblem.findMany({
      where: { slug: { in: problems.map((problem) => contentSlug("coding", problem.key)) } },
      select: { slug: true, testCases: { select: { isHidden: true } } },
    }),
    prisma.roadmap.findMany({
      where: {
        slug: { in: topics.map((topic) => contentSlug(topic.slug, "preparation-roadmap")) },
      },
      select: { _count: { select: { steps: true } } },
    }),
  ]);
  if (decks.some((deck) => deck._count.flashcards !== 20))
    throw new Error("Persisted flashcard counts do not match the required content.");
  if (
    quizzes.length !== topics.length ||
    quizzes.some(
      (quiz) =>
        quiz.questions.length !== 8 ||
        quiz.questions.some(
          (question) =>
            question.options.length !== 4 ||
            question.options.filter((option) => option.isCorrect).length !== 1
        )
    )
  ) {
    throw new Error("Persisted quiz questions/options do not match the required assessment shape.");
  }
  if (
    codingRows.some(
      (problem) =>
        problem.testCases.length < 6 ||
        problem.testCases.filter((testCase) => !testCase.isHidden).length < 2 ||
        problem.testCases.filter((testCase) => testCase.isHidden).length < 2
    )
  ) {
    throw new Error("Persisted coding fixtures do not meet the required public/hidden coverage.");
  }
  if (
    roadmapRows.length !== topics.length ||
    roadmapRows.some((roadmap) => roadmap._count.steps !== 6)
  ) {
    throw new Error("Persisted roadmap steps do not match the required six-step learning paths.");
  }
  console.info(
    JSON.stringify({
      verified: {
        questions: actual[0],
        notesAndCaseStudies: actual[1],
        roadmaps: actual[2],
        cheatSheets: actual[3],
        decks: actual[4],
        quizzes: actual[5],
        codingProblems: actual[6],
      },
    })
  );
}

async function main() {
  const publishedTopics = await inventory();
  if (parsedOptions.inventory) return;
  const [{ coreContent }, { webContent }, { systemsContent }, { codingContent, caseStudies }] =
    await Promise.all([
      import("./seeds/content/core"),
      import("./seeds/content/web"),
      import("./seeds/content/systems"),
      import("./seeds/content/practice"),
    ]);
  const { topics, problems, cases } = validateContent(
    [...coreContent, ...webContent, ...systemsContent],
    codingContent,
    caseStudies,
    topicsSeed.map((topic) => topic.slug)
  );
  console.info(JSON.stringify({ codingFixtureChecks: validatePracticeSolutions(problems) }));
  console.info(
    JSON.stringify({
      markdownDocumentsChecked: await validateMarkdownContent(topics, problems, cases),
    })
  );
  const topicIds = new Map(publishedTopics.map((topic) => [topic.slug, topic.id]));
  const missing = topics.filter((topic) => !topicIds.has(topic.slug));
  if (missing.length)
    throw new Error(
      `Required published topics are missing: ${missing.map((topic) => topic.slug).join(", ")}. Existing topics were not changed.`
    );
  console.info(
    JSON.stringify({
      mode: parsedOptions.apply ? "apply" : "dry-run",
      plan: {
        topics: topics.length,
        questions: topics.reduce((sum, topic) => sum + topic.questions.length, 0),
        notes: topics.reduce((sum, topic) => sum + topic.notes.length, 0),
        caseStudies: cases.length,
        roadmaps: topics.length,
        cheatSheets: topics.length,
        flashcards: topics.reduce((sum, topic) => sum + topic.questions.length, 0),
        quizzes: topics.length,
        quizQuestions: topics.reduce((sum, topic) => sum + topic.quiz.questions.length, 0),
        codingProblems: problems.length,
        resumeTemplates: resumeTemplateCatalog.length,
      },
    })
  );
  if (!parsedOptions.apply) return;
  const originalContent = await protectedContentSignature();
  const totals = emptyCounts();
  for (const topic of topics) {
    const topicId = topicIds.get(topic.slug);
    if (!topicId) throw new Error(`Missing topic ${topic.slug}`);
    const created = await publishTopic(topicId, topic);
    for (const name of Object.keys(totals) as (keyof Counts)[]) totals[name] += created[name];
  }
  for (const problem of problems) totals.problems += await publishProblem(problem);
  for (const study of cases) {
    const topicId = topicIds.get(study.topicSlug);
    if (!topicId) throw new Error(`Missing case-study topic ${study.topicSlug}`);
    totals.articles += await publishCaseStudy(topicId, study);
  }
  const templateSetting = await prisma.systemSetting.findUnique({
    where: { key: "resume_template_catalog" },
    select: { id: true },
  });
  if (!templateSetting) {
    await prisma.systemSetting.create({
      data: { key: "resume_template_catalog", category: "resume", value: resumeTemplateCatalog },
    });
    totals.templates = resumeTemplateCatalog.length;
  }
  console.info(JSON.stringify({ created: totals }));
  await verifyPublished(topics, problems, cases);
  const preservedContent = await protectedContentSignature();
  if (originalContent.hash !== preservedContent.hash) {
    throw new Error(
      "Existing editorial content changed during publication. Check for concurrent edits; the seeder does not update or delete existing records."
    );
  }
  console.info(JSON.stringify({ preservedExistingRecords: originalContent.count }));
  if (Object.values(totals).some((count) => count > 0)) {
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "content_library",
        entityId: "interviewhub-original-v1",
        newData: { source: "original-content-seed", created: { ...totals } },
      },
    });
  }
}

main()
  .catch((error: unknown) => {
    if (error instanceof z.ZodError) {
      console.error(
        JSON.stringify({
          error: "Content validation failed",
          issues: error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
        })
      );
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
