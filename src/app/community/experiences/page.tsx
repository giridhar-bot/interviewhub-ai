import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getInterviewExperiences } from "@/services/community.service";

export const metadata = generateSEO({
  title: "Interview Experiences — Stories from Engineers",
  description: "Read published interview experiences shared by community members.",
  path: "/community/experiences",
  keywords: ["interview experience", "tech interview", "interview preparation"],
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ company?: string | string[] }>;

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedCompany = Array.isArray(params.company) ? params.company[0] : params.company;
  const allExperiences = await getInterviewExperiences(100);
  const experiences = selectedCompany
    ? allExperiences.filter((experience) => experience.company.slug === selectedCompany)
    : allExperiences;
  const companies = Array.from(
    new Map(allExperiences.map((experience) => [experience.company.slug, experience.company.name])).entries()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Experiences", href: "/community/experiences" },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Interview Experiences</h1>
          <p className="mt-1 text-muted-foreground">Published experiences from community members.</p>
        </div>
        <Link href="/community/ask"><Button>Share Your Experience</Button></Link>
      </div>

      {companies.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/community/experiences">
            <Badge variant={!selectedCompany ? "default" : "outline"}>All</Badge>
          </Link>
          {companies.map(([slug, name]) => (
            <Link key={slug} href={`/community/experiences?company=${encodeURIComponent(slug)}`}>
              <Badge variant={selectedCompany === slug ? "default" : "outline"}>{name}</Badge>
            </Link>
          ))}
        </div>
      )}

      {experiences.length ? (
        <div className="mt-8 space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{experience.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {experience.company.name} · {experience.role} · {experience.rounds} rounds · {experience.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                      {experience.author?.name ? ` · ${experience.author.name}` : ""}
                    </CardDescription>
                    <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm">{experience.content}</p>
                    {experience.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {experience.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline">{experience.result.replace(/_/g, " ")}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No published interview experiences match this filter.
        </p>
      )}
    </div>
  );
}