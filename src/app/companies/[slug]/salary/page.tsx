import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return generateSEO({
    title: `${name} Salary Insights — Base, Total Comp & Benefits`,
    description: `Anonymous salary data from ${name} employees. Compare base salary, total compensation, and benefits across roles and experience levels.`,
    path: `/companies/${slug}/salary`,
  });
}

const salaryData = [
  { role: "SDE-1 / SWE I", level: "L3", base: "₹18-28L", total: "₹22-35L", stocks: "₹2-5L/yr", reports: 25, yoeRange: "0-2 yrs" },
  { role: "SDE-2 / SWE II", level: "L4", base: "₹30-45L", total: "₹38-55L", stocks: "₹5-12L/yr", reports: 18, yoeRange: "2-5 yrs" },
  { role: "SDE-3 / Senior SWE", level: "L5", base: "₹50-70L", total: "₹65-90L", stocks: "₹15-25L/yr", reports: 8, yoeRange: "5-8 yrs" },
  { role: "Staff Engineer", level: "L6", base: "₹70-100L", total: "₹90-130L", stocks: "₹25-40L/yr", reports: 4, yoeRange: "8+ yrs" },
  { role: "Engineering Manager", level: "M1", base: "₹60-85L", total: "₹80-110L", stocks: "₹20-30L/yr", reports: 6, yoeRange: "6+ yrs" },
];

export default async function CompanySalaryPage({ params }: Props) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Companies", href: "/companies" },
              { name, href: `/companies/${slug}` },
              { name: "Salary", href: `/companies/${slug}/salary` },
            ])
          ),
        }}
      />

      <h1 className="text-3xl font-extrabold tracking-tight">
        {name}{" "}
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Salary Insights
        </span>
      </h1>
      <p className="mt-2 text-muted-foreground">
        Anonymous salary data contributed by {name} employees. All figures in INR per annum.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Level</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Base Salary</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Total Comp</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">YoE</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Reports</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((s) => (
              <tr key={s.role} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{s.role}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{s.level}</Badge>
                </td>
                <td className="px-6 py-4 text-sm">{s.base}</td>
                <td className="px-6 py-4 text-sm font-medium text-green-600">{s.total}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{s.yoeRange}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{s.reports}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Share Your Salary</CardTitle>
          <CardDescription>
            Help others by anonymously sharing your compensation details. All data is kept confidential.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
