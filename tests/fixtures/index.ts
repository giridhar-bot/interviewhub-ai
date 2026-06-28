// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Test Fixtures
// ══════════════════════════════════════════════════════════════

export const testUser = {
  id: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
  username: "testuser",
  role: "USER" as const,
  status: "ACTIVE" as const,
};

export const testArticle = {
  id: "test-article-id",
  title: "Test Article",
  slug: "test-article",
  content: "Test content for the article.",
  topicId: "test-topic-id",
  status: "PUBLISHED" as const,
};

export const testCompany = {
  id: "test-company-id",
  name: "Test Corp",
  slug: "test-corp",
  industry: "Technology",
};
