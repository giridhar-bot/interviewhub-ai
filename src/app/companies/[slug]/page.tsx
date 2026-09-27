import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateCompanySEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import {
  getCompanyExperiences,
  getCompanyProfile,
  getCompanyQuestions,
  getCompanySalaries,
} from "@/services/company-prep.service";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

const difficultyLabels: Record<string, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

function formatAmount(value: number | null, currency: string) {
  if (value === null) return "Not reported";
  return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)} ${currency}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);

  return generateCompanySEO({
    name: company?.name ?? slug.replace(/-/g, " "),
    slug,
    description: company?.description ?? "Published company profile and interview preparation data.",
  });
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyProfile(slug);

  if (!company) notFound();

  const [questionResult, experienceResult, salaryResult] = await Promise.all([
    getCompanyQuestions(company.id, { page: 1, limit: 6 }),
    getCompanyExperiences(company.id, 1, 3),
    getCompanySalaries(company.id),
  ]);

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
            ])
          ),
        }}
      />

      <div className="flex items-start gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-3xl font-bold text-violet-600">
          {company.name[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight">{company.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {[company.industry, company.headquarters].filter(Boolean).join(" • ") || "Company profile"}
          </p>
          {company.description && (
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{company.description}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{company._count.questions} Questions</Badge>
            <Badge variant="secondary">{company._count.experiences} Experiences</Badge>
            <Badge variant="secondary">{company._count.salaryInsights} Salary Reports</Badge>
          </div>
        </div>
        <Button>Create Prep Plan</Button>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Interview Rounds", value: company.interviewRounds.length },
          { label: "Published Questions", value: company._count.questions },
          { label: "Experiences", value: company._count.experiences },
          { label: "Salary Reports", value: company._count.salaryInsights },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Interview Questions</h2>
          <Link href={`/companies/${slug}/questions`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {questionResult.questions.length ? (
          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Question</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {questionResult.questions.map((question) => (
                  <tr key={question.id} className="border-b last:border-0">
                    <td className="px-6 py-4 font-medium">{question.title}</td>
                    <td className="px-6 py-4"><Badge variant="outline">{question.type.replace(/_/g, " ")}</Badge></td>
                    <td className="px-6 py-4 text-sm">{difficultyLabels[question.difficulty] ?? question.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No published interview questions for this company yet.
          </p>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Interview Experiences</h2>
          <Link href={`/companies/${slug}/experiences`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {experienceResult.experiences.length ? (
          <div className="mt-6 space-y-4">
            {experienceResult.experiences.map((experience) => (
              <Card key={experience.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{experience.role} Interview</CardTitle>
                    <CardDescription>
                      {experience.rounds} rounds{experience.yoe !== null ? ` • ${experience.yoe} YoE` : ""}
                      {` • ${experience.createdAt.toLocaleDateString("en", { month: "short", year: "numeric" })}`}
                    </CardDescription>
                    <p className="mt-3 line-clamp-3 text-sm">{experience.content}</p>
                  </div>
                  <Badge variant="outline">{experience.result.replace(/_/g, " ")}</Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No published interview experiences for this company yet.
          </p>
        )}
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Salary Insights</h2>
          <Link href={`/companies/${slug}/salary`}>
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        {salaryResult.salaries.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {salaryResult.salaries.slice(0, 6).map((salary) => (
              <Card key={salary.role}>
                <CardHeader>
                  <CardTitle className="text-base">{salary.role}</CardTitle>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Base</span>
                      <span className="font-medium">{formatAmount(salary.avgBaseSalary, salary.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Total</span>
                      <span className="font-medium">{formatAmount(salary.avgTotalComp, salary.currency)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{salary.count} reports</div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No salary reports for this company yet.
          </p>
        )}
      </section>
    </div>
  );
}