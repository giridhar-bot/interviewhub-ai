import assert from "node:assert/strict";
import { test } from "node:test";
import { coreContent } from "../prisma/seeds/content/core";
import { webContent } from "../prisma/seeds/content/web";
import { systemsContent } from "../prisma/seeds/content/systems";
import { codingContent, caseStudies } from "../prisma/seeds/content/practice";
import { topicsSeed } from "../prisma/seeds/topics";
import {
  validateContent,
  validatePracticeSolutions,
  validateMarkdownContent,
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
