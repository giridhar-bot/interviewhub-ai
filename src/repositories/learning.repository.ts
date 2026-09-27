import { prisma } from "@/lib/prisma";

export const learningRepository = {
  async getActiveTechnologyNames() {
    const technologies = await prisma.technology.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { name: true },
    });
    return technologies.map((technology) => technology.name);
  },

  async getPublicContentCounts() {
    const [articles, roadmaps, flashcardDecks, quizzes, cheatSheets, leaderboardUsers] =
      await Promise.all([
        prisma.article.count({ where: { status: "PUBLISHED", deletedAt: null } }),
        prisma.roadmap.count({ where: { status: "PUBLISHED", isPublished: true, deletedAt: null } }),
        prisma.flashcardDeck.count({ where: { status: "PUBLISHED" } }),
        prisma.quiz.count({ where: { status: "PUBLISHED" } }),
        prisma.cheatSheet.count({ where: { status: "PUBLISHED", deletedAt: null } }),
        prisma.user.count({ where: { deletedAt: null, bannedAt: null, xp: { gt: 0 } } }),
      ]);

    return { articles, roadmaps, flashcardDecks, quizzes, cheatSheets, leaderboardUsers };
  },
};