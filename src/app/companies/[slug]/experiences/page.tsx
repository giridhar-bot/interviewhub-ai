import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { generateSEO } from "@/lib/seo";
import { getCompanyExperiences, getCompanyProfile } from "@/services/company-prep.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);
  const name = company?.name ?? slug.replace(/-/g, " ");

  return generateSEO({
    title: `${name} Interview Experiences`,
    description: `Published interview experiences for ${name}.`,
    path: `/companies/${slug}/experiences`,
  });
}

export default async function CompanyExperiencesPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);

  if (!company) notFound();

  const { experiences, total } = await getCompanyExperiences(company.id, 1, 30);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Companies", href: "/companies" },
              { name: company.name, href: `/companies/${slug}` },
              { name: "Experiences", href: `/companies/${slug}/experiences` },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{company.name} Interview Experiences</h1>
          <p className="mt-2 text-muted-foreground">
            {total} published experience{total === 1 ? "" : "s"}
          </p>
        </div>
        <Button>Share Your Experience</Button>
      </div>

      {experiences.length ? (
        <div className="mt-8 space-y-4">
          {experiences.map((experience) => (
            <Card key={experience.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-lg">{experience.title}</CardTitle>
                  <Badge variant="outline">{experience.result.replace(/_/g, " ")}</Badge>
                </div>
                <CardDescription>
                  {experience.role} · {experience.rounds} rounds
                  {experience.yoe !== null ? ` · ${experience.yoe} years experience` : ""}
                  {` · ${experience.createdAt.toLocaleDateString("en", { month: "short", year: "numeric" })}`}
                  {experience.author?.name ? ` · ${experience.author.name}` : ""}
                </CardDescription>
                <p className="mt-3 whitespace-pre-line text-sm">{experience.content}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No published interview experiences for {company.name} yet.
        </p>
      )}
    </div>
  );
}