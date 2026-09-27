import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { generateSEO } from "@/lib/seo";
import { getCompanyProfile, getCompanySalaries } from "@/services/company-prep.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function formatAmount(value: number | null, currency: string) {
  if (value === null) return "Not reported";
  return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)} ${currency}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);
  const name = company?.name ?? slug.replace(/-/g, " ");

  return generateSEO({
    title: `${name} Salary Insights`,
    description: `Salary reports published for ${name}.`,
    path: `/companies/${slug}/salary`,
  });
}

export default async function CompanySalaryPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);

  if (!company) notFound();

  const { salaries, total } = await getCompanySalaries(company.id);

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
              { name: "Salary", href: `/companies/${slug}/salary` },
            ])
          ),
        }}
      />

      <h1 className="text-3xl font-extrabold tracking-tight">{company.name} Salary Insights</h1>
      <p className="mt-2 text-muted-foreground">
        {total} salary report{total === 1 ? "" : "s"} in the database.
      </p>

      {salaries.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {salaries.map((salary) => (
            <Card key={`${salary.role}-${salary.currency}`}>
              <CardHeader>
                <CardTitle className="text-base">{salary.role}</CardTitle>
                <CardDescription>{salary.count} report{salary.count === 1 ? "" : "s"} · {salary.currency}</CardDescription>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Base</span>
                    <span className="font-medium">{formatAmount(salary.avgBaseSalary, salary.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Total Compensation</span>
                    <span className="font-medium">{formatAmount(salary.avgTotalComp, salary.currency)}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No salary reports for {company.name} yet.
        </p>
      )}
    </div>
  );
}