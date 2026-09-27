import { HeroSection } from "@/components/landing/hero-section";
import { TrustedBySection } from "@/components/landing/trusted-by-section";
import { SearchSection } from "@/components/landing/search-section";
import { StatsSection } from "@/components/landing/stats-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TopicsSection } from "@/components/landing/topics-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCount(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export default async function Home() {
  const [topics, companies, topicCount, questionCount, technologyCount, learnerCount] =
    await Promise.all([
      prisma.topic.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: { name: true, slug: true, category: true, order: true },
        orderBy: { order: "asc" },
        take: 48,
      }),
      prisma.company.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: { name: true, slug: true },
        orderBy: { name: "asc" },
        take: 12,
      }),
      prisma.topic.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.question.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.technology.count({ where: { status: "ACTIVE", deletedAt: null } }),
      prisma.user.count({ where: { status: "ACTIVE", deletedAt: null } }),
    ]);

  const topicsByCategory = new Map<string, Array<{ name: string; slug: string }>>();

  for (const topic of topics) {
    const categoryTopics = topicsByCategory.get(topic.category) ?? [];
    categoryTopics.push({ name: topic.name, slug: topic.slug });
    topicsByCategory.set(topic.category, categoryTopics);
  }

  const categories = Array.from(topicsByCategory, ([title, categoryTopics]) => ({
    title,
    topics: categoryTopics,
  }));

  const stats = [
    { value: formatCount(topicCount), label: "Interview Topics" },
    { value: formatCount(questionCount), label: "Practice Questions" },
    { value: formatCount(technologyCount), label: "Technologies" },
    { value: formatCount(learnerCount), label: "Learners" },
  ];

  return (
    <>
      <HeroSection />
      <TrustedBySection companies={companies} />
      <SearchSection trendingTopics={topics.slice(0, 10)} />
      <StatsSection stats={stats} />
      <FeaturesSection />
      <TopicsSection categories={categories} />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
