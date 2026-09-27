import { Badge } from "@/components/ui/badge";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { generateSEO } from "@/lib/seo";
import { getCompanyProfile, getCompanyQuestions } from "@/services/company-prep.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);
  const name = company?.name ?? slug.replace(/-/g, " ");

  return generateSEO({
    title: `${name} Interview Questions — Coding, System Design, HR`,
    description: `Browse published interview questions for ${name}.`,
    path: `/companies/${slug}/questions`,
  });
}

export default async function CompanyQuestionsPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);

  if (!company) notFound();

  const { questions, total } = await getCompanyQuestions(company.id, { limit: 50 });

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
              { name: "Questions", href: `/companies/${slug}/questions` },
            ])
          ),
        }}
      />

      <h1 className="text-3xl font-extrabold tracking-tight">
        {company.name} Interview Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        {total} published question{total === 1 ? "" : "s"}
      </p>

      {questions.length ? (
        <div className="mt-8 overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Question</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Views</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-medium">{question.title}</td>
                  <td className="px-6 py-4"><Badge variant="outline">{question.type.replace(/_/g, " ")}</Badge></td>
                  <td className="px-6 py-4">{question.difficulty}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{question.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No published interview questions for {company.name} yet.
        </p>
      )}
    </div>
  );
}