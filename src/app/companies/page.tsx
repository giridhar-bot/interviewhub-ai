import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Company Preparation — Interview Questions by Company",
  description:
    "Prepare for interviews at Google, Amazon, Microsoft, Meta, Flipkart, TCS, Infosys & more with company-specific questions, salary insights, and real experiences.",
  path: "/companies",
  keywords: ["company interview questions", "Google interview", "Amazon interview", "Microsoft interview", "TCS interview", "salary insights", "interview experiences"],
});

const companies = [
  { name: "Google", industry: "Tech", questions: 450, experiences: 120, slug: "google" },
  { name: "Amazon", industry: "Tech", questions: 380, experiences: 95, slug: "amazon" },
  { name: "Microsoft", industry: "Tech", questions: 320, experiences: 85, slug: "microsoft" },
  { name: "Meta", industry: "Tech", questions: 290, experiences: 70, slug: "meta" },
  { name: "Apple", industry: "Tech", questions: 200, experiences: 45, slug: "apple" },
  { name: "Flipkart", industry: "E-Commerce", questions: 180, experiences: 60, slug: "flipkart" },
  { name: "TCS", industry: "Consulting", questions: 250, experiences: 110, slug: "tcs" },
  { name: "Infosys", industry: "Consulting", questions: 220, experiences: 90, slug: "infosys" },
  { name: "Wipro", industry: "Consulting", questions: 180, experiences: 75, slug: "wipro" },
  { name: "Accenture", industry: "Consulting", questions: 200, experiences: 80, slug: "accenture" },
  { name: "Deloitte", industry: "Consulting", questions: 160, experiences: 55, slug: "deloitte" },
  { name: "Netflix", industry: "Tech", questions: 150, experiences: 35, slug: "netflix" },
  { name: "Razorpay", industry: "Fintech", questions: 120, experiences: 40, slug: "razorpay" },
  { name: "Swiggy", industry: "Tech", questions: 100, experiences: 30, slug: "swiggy" },
  { name: "Uber", industry: "Tech", questions: 200, experiences: 50, slug: "uber" },
];

export default function CompaniesPage() {
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
                    {company.industry}
                  </Badge>
                </div>
                <CardDescription className="mt-2">
                  <div className="flex gap-4 text-sm">
                    <span>{company.questions} questions</span>
                    <span>{company.experiences} experiences</span>
                  </div>
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
