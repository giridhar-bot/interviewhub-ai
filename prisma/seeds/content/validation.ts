import { z } from "zod";
import { Script, createContext } from "node:vm";
import { isDeepStrictEqual } from "node:util";
import { compileMdxContent } from "../../../src/lib/mdx";
import type { CaseStudyContent, CodingContent, TopicContent } from "./types";

const key = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const reference = z.object({
  title: z.string().min(5),
  url: z.url().refine((value) => new URL(value).protocol === "https:", "References must use HTTPS"),
  provider: z.string().min(2),
});

const topicSchema = z
  .object({
    slug: key,
    references: z.array(reference).min(2),
    questions: z
      .array(
        z.object({
          key,
          title: z.string().min(10),
          prompt: z.string().min(25),
          answer: z.string().min(220),
          difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
          tags: z.array(z.string().min(2)).min(1),
        })
      )
      .length(20),
    notes: z
      .array(
        z.object({
          key,
          title: z.string().min(10),
          excerpt: z.string().min(40),
          content: z.string().min(1800),
        })
      )
      .length(3),
    roadmap: z.object({
      title: z.string().min(10),
      description: z.string().min(50),
      estimatedHours: z.number().int().positive(),
      steps: z
        .array(
          z.object({
            title: z.string().min(5),
            description: z.string().min(50),
            hours: z.number().int().positive(),
          })
        )
        .length(6),
    }),
    cheatSheet: z.object({
      title: z.string().min(10),
      content: z.string().min(1000),
    }),
    quiz: z.object({
      title: z.string().min(10),
      questions: z
        .array(
          z.object({
            question: z.string().min(20),
            options: z.array(z.string().min(2)).length(4),
            correctIndex: z.number().int().min(0).max(3),
            explanation: z.string().min(80),
          })
        )
        .length(8),
    }),
  })
  .superRefine((topic, context) => {
    for (const field of ["questions", "notes"] as const) {
      if (new Set(topic[field].map((item) => item.key)).size !== topic[field].length) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: "Content keys must be unique within a topic.",
        });
      }
      if (
        new Set(topic.questions.map((question) => question.title.trim().toLowerCase())).size !==
        topic.questions.length
      ) {
        context.addIssue({
          code: "custom",
          path: ["questions"],
          message: "Interview questions must have distinct titles.",
        });
      }
    }
    if (
      topic.roadmap.steps.reduce((sum, step) => sum + step.hours, 0) !==
      topic.roadmap.estimatedHours
    ) {
      context.addIssue({
        code: "custom",
        path: ["roadmap", "estimatedHours"],
        message: "Roadmap hours must equal the sum of step hours.",
      });
    }
    topic.quiz.questions.forEach((question, index) => {
      if (new Set(question.options).size !== question.options.length) {
        context.addIssue({
          code: "custom",
          path: ["quiz", "questions", index, "options"],
          message: "Quiz options must be distinct.",
        });
        if (new Set(topic.references.map((item) => item.url)).size !== topic.references.length) {
          context.addIssue({
            code: "custom",
            path: ["references"],
            message: "References must have distinct URLs.",
          });
        }
      }
    });
  });

const json = z.string().refine((value) => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}, "Test inputs and expected results must be valid JSON.");

const codingSchema = z
  .object({
    key,
    title: z.string().min(10),
    description: z.string().min(150),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    category: z.string().min(3),
    constraints: z.string().min(30),
    examples: z
      .array(z.object({ input: json, output: json, explanation: z.string().min(15) }))
      .min(2),
    hints: z.array(z.string().min(10)).min(2),
    tags: z.array(z.string().min(2)).min(1),
    solution: z.string().min(200),
    solutionCode: z.string().min(40),
    testCases: z.array(z.object({ input: json, expected: json, hidden: z.boolean() })).min(6),
  })
  .refine(
    (problem) =>
      problem.testCases.filter((item) => item.hidden).length >= 2 &&
      problem.testCases.filter((item) => !item.hidden).length >= 2,
    {
      message: "Each exercise needs at least two public and two hidden regression cases.",
    }
  );

const caseStudySchema = z.object({
  topicSlug: z.enum(["system-design", "low-level-design"]),
  key,
  title: z.string().min(10),
  excerpt: z.string().min(50),
  content: z.string().min(3000),
  tags: z.array(z.string().min(2)).min(1),
  references: z.array(reference).min(2),
});

export function validateContent(
  topics: TopicContent[],
  problems: CodingContent[],
  cases: CaseStudyContent[],
  expectedTopics: string[]
) {
  const result = {
    topics: z.array(topicSchema).parse(topics),
    problems: z.array(codingSchema).length(24).parse(problems),
    cases: z.array(caseStudySchema).length(8).parse(cases),
  };
  if (new Set(result.topics.map((topic) => topic.slug)).size !== result.topics.length) {
    throw new Error("Topic content contains duplicate topics.");
  }
  const missing = expectedTopics.filter(
    (slug) => !result.topics.some((topic) => topic.slug === slug)
  );
  const extra = result.topics.filter((topic) => !expectedTopics.includes(topic.slug));
  if (missing.length || extra.length) {
    throw new Error(
      `Topic coverage mismatch: missing [${missing.join(", ")}], unexpected [${extra.map((topic) => topic.slug).join(", ")}].`
    );
  }
  for (const [name, items] of [
    ["coding", result.problems],
    ["case studies", result.cases],
  ] as const) {
    if (new Set(items.map((item) => item.key)).size !== items.length) {
      throw new Error(`Duplicate ${name} content keys.`);
    }
  }
  return result;
}

export function contentSlug(topic: string, key: string) {
  return `ih-${topic}-${key}`;
}

export function withReferences(content: string, references: { title: string; url: string }[]) {
  return `${content.trim()}\n\n## References and further reading\n\nOriginal InterviewHub AI learning material. The following references provide further study; their text is not reproduced here.\n\n${references.map((item) => `- [${item.title}](${item.url})`).join("\n")}\n`;
}

export function publicationContent(content: string) {
  const lines = content.split(/\r?\n/);
  function hasCitation(start: number, level: number) {
    let codeFence: { marker: string; length: number } | undefined;
    for (let index = start + 1; index < lines.length; index++) {
      const marker = lines[index].match(/^\s*(`{3,}|~{3,})/);
      if (marker) {
        if (!codeFence) codeFence = { marker: marker[1][0], length: marker[1].length };
        else if (marker[1][0] === codeFence.marker && marker[1].length >= codeFence.length)
          codeFence = undefined;
        continue;
      }
      if (codeFence) continue;
      const heading = lines[index].match(/^(#{1,6})\s+/);
      if (heading && heading[1].length <= level) return false;
      if (
        /\[[^\]]+\]\(https?:\/\//.test(lines[index]) ||
        /^\s*[-*]\s+https?:\/\//.test(lines[index])
      )
        return true;
    }
    return false;
  }
  const output: string[] = [];
  let fence: { marker: string; length: number } | undefined;
  let omittedLevel: number | undefined;
  for (const [index, line] of lines.entries()) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = { marker: marker[1][0], length: marker[1].length };
      else if (marker[1][0] === fence.marker && marker[1].length >= fence.length) fence = undefined;
      if (omittedLevel === undefined) output.push(line);
      continue;
    }
    if (!fence) {
      if (
        /^\s*(background|references?|sources?|further reading):.*\[[^\]]+\]\(https?:\/\//i.test(
          line
        )
      )
        continue;
      const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (heading) {
        const level = heading[1].length;
        if (omittedLevel !== undefined && level <= omittedLevel) omittedLevel = undefined;
        if (
          /^(references and further reading|further reading|sources)$/i.test(heading[2]) &&
          hasCitation(index, level)
        ) {
          omittedLevel = level;
          continue;
        }
      }
    }
    if (omittedLevel === undefined) output.push(line);
  }
  return output.join("\n").trim();
}

export interface ReferenceRemoval {
  slug: string;
  legacyContent: string;
  publicContent: string;
}

export function planReferenceRemoval(
  stored: { slug: string; content: string | null }[],
  desired: ReferenceRemoval[]
) {
  const records = new Map(stored.map((row) => [row.slug, row.content]));
  return desired.filter((row) => {
    if (!records.has(row.slug)) throw new Error(`Generated content is missing: ${row.slug}`);
    const current = records.get(row.slug);
    if (current === row.publicContent) return false;
    if (current !== row.legacyContent)
      throw new Error(`Content was edited; reference cleanup will not overwrite it: ${row.slug}`);
    return true;
  });
}

export function validatePracticeSolutions(problems: CodingContent[]) {
  let checks = 0;
  for (const problem of problems) {
    const script = new Script(`${problem.solutionCode}\nJSON.stringify(solve(input));`);
    const examples = problem.examples.map((example) => ({
      input: example.input,
      expected: example.output,
    }));
    for (const fixture of [...problem.testCases, ...examples]) {
      const context = createContext({ input: JSON.parse(fixture.input) });
      const encoded: unknown = script.runInContext(context, { timeout: 1000 });
      if (typeof encoded !== "string")
        throw new Error(
          `Coding solution ${problem.key} did not return a JSON-serializable result.`
        );
      if (!isDeepStrictEqual(JSON.parse(encoded), JSON.parse(fixture.expected))) {
        throw new Error(
          `Coding solution failed a test or example: ${problem.key}, input ${fixture.input}`
        );
      }
      checks++;
    }
  }
  return checks;
}

export async function validateMarkdownContent(
  topics: TopicContent[],
  problems: CodingContent[],
  cases: CaseStudyContent[]
) {
  const documents = [
    ...topics.flatMap((topic) => [
      ...topic.notes.map((note) => ({
        name: `${topic.slug}/${note.key}`,
        content: publicationContent(note.content),
      })),
      ...topic.questions.map((question) => ({
        name: `${topic.slug}/${question.key}`,
        content: publicationContent(question.answer),
      })),
      {
        name: `${topic.slug}/cheatsheet`,
        content: publicationContent(topic.cheatSheet.content),
      },
    ]),
    ...cases.map((study) => ({
      name: study.key,
      content: publicationContent(study.content),
    })),
    ...problems.map((problem) => ({
      name: problem.key,
      content: `${publicationContent(problem.solution)}\n\n\`\`\`javascript\n${problem.solutionCode}\n\`\`\`\n`,
    })),
  ];
  const failures: string[] = [];
  for (const document of documents) {
    try {
      await compileMdxContent(document.content);
    } catch (error) {
      failures.push(
        `${document.name}: ${error instanceof Error ? error.message : "Unknown Markdown compilation error"}`
      );
    }
  }
  if (failures.length)
    throw new Error(`Published Markdown validation failed:\n${failures.join("\n")}`);
  return documents.length;
}
