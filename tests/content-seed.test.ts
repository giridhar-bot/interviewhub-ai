import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { compileMdxContent } from "../src/lib/mdx";
import { coreContent } from "../prisma/seeds/content/core";
import { webContent } from "../prisma/seeds/content/web";
import { systemsContent } from "../prisma/seeds/content/systems";
import { codingContent, caseStudies } from "../prisma/seeds/content/practice";
import { topicsSeed } from "../prisma/seeds/topics";
import {
  validateContent,
  validatePracticeSolutions,
  validateMarkdownContent,
  publicationContent,
  planReferenceRemoval,
} from "../prisma/seeds/content/validation";

const topics = [...coreContent, ...webContent, ...systemsContent];
const expectedTopics = topicsSeed.map((topic) => topic.slug);

test("validates all published learning content and executes every coding example and fixture", () => {
  validateContent(topics, codingContent, caseStudies, expectedTopics);
  const count = validatePracticeSolutions(codingContent);
  assert.equal(
    count,
    codingContent.reduce(
      (sum, problem) => sum + problem.examples.length + problem.testCases.length,
      0
    )
  );
});

test("rejects duplicate keys, incomplete topic coverage, inconsistent roadmap hours and ambiguous quiz options before publication", () => {
  const duplicate = structuredClone(topics);
  duplicate[0].questions[1].key = duplicate[0].questions[0].key;
  assert.throws(() => validateContent(duplicate, codingContent, caseStudies, expectedTopics));
  assert.throws(
    () => validateContent(topics.slice(1), codingContent, caseStudies, expectedTopics),
    /coverage mismatch/
  );
  const hours = structuredClone(topics);
  hours[0].roadmap.estimatedHours++;
  assert.throws(() => validateContent(hours, codingContent, caseStudies, expectedTopics));
  const options = structuredClone(topics);
  options[0].quiz.questions[0].options[1] = options[0].quiz.questions[0].options[0];
  assert.throws(() => validateContent(options, codingContent, caseStudies, expectedTopics));
});

test("rejects a wrong coding expected result and invalid JSON fixtures", () => {
  const problems = structuredClone(codingContent);
  problems[0].testCases[0].expected = '{"wrong":true}';
  assert.throws(() => validatePracticeSolutions(problems), /failed a test/);
  problems[0].testCases[0].input = "{broken";
  assert.throws(() => validateContent(topics, problems, caseStudies, expectedTopics));
});

test("compiles every original note, answer, cheat sheet, architecture article and coding solution with the actual MDX renderer", async () => {
  await validateMarkdownContent(topics, codingContent, caseStudies);
});

test("rejects unsafe Markdown syntax before it can be published", async () => {
  const topic = structuredClone(topics[0]);
  topic.questions[0].answer = "A literal comparison x <= y must be written as inline code.";
  await assert.rejects(
    () => validateMarkdownContent([topic], [], []),
    /Markdown validation failed/
  );
});

test("keeps headings and anchor links unique when multiple answers share the same heading", async () => {
  const [first, second, normal] = await Promise.all([
    compileMdxContent("## References", "question-a-"),
    compileMdxContent("## References", "question-b-"),
    compileMdxContent("## References"),
  ]);
  const firstHtml = renderToStaticMarkup(first.content);
  const secondHtml = renderToStaticMarkup(second.content);
  assert.match(firstHtml, /id="question-a-references"/);
  assert.match(firstHtml, /href="#question-a-references"/);
  assert.match(secondHtml, /id="question-b-references"/);
  assert.match(renderToStaticMarkup(normal.content), /id="references"/);
});

test("removes bibliography sections without losing technical references, code examples or later chapters", () => {
  const input = [
    "## References",
    "Object references preserve identity.",
    "````markdown",
    "```text",
    "[Example](https://example.test)",
    "```",
    "````",
    "Background: [Pattern](https://pattern.example.test) explains this pattern.",
    "## Further reading",
    "- [Guide](https://guide.example.test)",
    "## Practice",
    "Solve the exercise.",
  ].join("\n");
  const result = publicationContent(input);
  assert.match(result, /Object references preserve identity/);
  assert.match(result, /\[Example\]\(https:\/\/example.test\)/);
  assert.match(result, /## Practice\nSolve the exercise/);
  assert.doesNotMatch(result, /Further reading|guide.example.test|pattern.example.test/);
});

test("reference cleanup is idempotent and refuses to replace edited content", () => {
  const desired = [
    { slug: "ih-example", legacyContent: "Original with bibliography", publicContent: "Original" },
  ];
  assert.equal(
    planReferenceRemoval([{ slug: "ih-example", content: desired[0].legacyContent }], desired)
      .length,
    1
  );
  assert.equal(
    planReferenceRemoval([{ slug: "ih-example", content: desired[0].publicContent }], desired)
      .length,
    0
  );
  assert.throws(
    () => planReferenceRemoval([{ slug: "ih-example", content: "Editor changes" }], desired),
    /will not overwrite/
  );
});

test("published learning material does not expose editorial source links", () => {
  for (const topic of topics) {
    const content = [
      ...topic.notes.map((note) => note.content),
      ...topic.questions.map((question) => question.answer),
      topic.cheatSheet.content,
    ];
    for (const document of content)
      for (const reference of topic.references) {
        assert(
          !publicationContent(document).includes(reference.url),
          `${topic.slug} exposes a source link`
        );
      }
  }
  for (const study of caseStudies)
    for (const reference of study.references) {
      assert(
        !publicationContent(study.content).includes(reference.url),
        `${study.key} exposes a source link`
      );
    }
  for (const problem of codingContent) {
    assert.doesNotMatch(
      publicationContent(problem.solution),
      /## Further reading|interviewbit\.com|geeksforgeeks\.org/
    );
  }
});
