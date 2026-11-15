export interface Reference {
  title: string;
  url: string;
  provider: string;
}

export interface TopicContent {
  slug: string;
  references: Reference[];
  questions: {
    key: string;
    title: string;
    prompt: string;
    answer: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    tags: string[];
  }[];
  notes: { key: string; title: string; excerpt: string; content: string }[];
  roadmap: {
    title: string;
    description: string;
    estimatedHours: number;
    steps: { title: string; description: string; hours: number }[];
  };
  cheatSheet: { title: string; content: string };
  quiz: {
    title: string;
    questions: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }[];
  };
}

export interface CodingContent {
  key: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  category: string;
  constraints: string;
  examples: { input: string; output: string; explanation: string }[];
  hints: string[];
  tags: string[];
  solution: string;
  solutionCode: string;
  testCases: { input: string; expected: string; hidden: boolean }[];
}

export interface CaseStudyContent {
  topicSlug: "system-design" | "low-level-design";
  key: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  references: Reference[];
}
