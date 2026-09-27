import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { getCompanies } from "@/services/company.service";

export const metadata = generateSEO({
  title: "Company Preparation — Interview Questions by Company",
  description: "Explore published company profiles, interview questions, salary insights, and experiences.",
  path: "/companies",
  keywords: ["company interview questions", "Google interview", "Amazon interview", "Microsoft interview", "TCS interview", "salary insights", "interview experiences"],
});

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Company{" "}
          <span className="text-gradient">Preparation</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Prepare with company-specific interview questions, processes,
          salary data, and real experiences.
        </p>
      </div>

      {companies.length ? (
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link key={company.slug} href={`/companies/${company.slug}`}>
            <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg group-hover:text-primary">
                    {company.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {company.industry ?? "Other"}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  <div className="flex gap-4 text-sm">
                    <span>{company._count.questions} questions</span>
                    <span>{company._count.experiences} experiences</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        </div>
      ) : (
        <p className="mt-16 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No published company profiles yet.
        </p>
      )}
    </div>
  );
}
