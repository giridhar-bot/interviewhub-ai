import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";
import { adminRepository } from "@/repositories/admin.repository";

export const metadata = generateSEO({
  title: "Company Management — Admin",
  description: "Manage company profiles, questions, and experiences.",
  path: "/admin/companies",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-50 text-green-600",
  DRAFT: "bg-yellow-50 text-yellow-600",
  REVIEW: "bg-blue-50 text-blue-600",
  ARCHIVED: "bg-muted text-muted-foreground",
};

export default async function AdminCompaniesPage() {
  const companies = await adminRepository.getCompanyAdminList();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Company Management</h1>
          <p className="mt-1 text-muted-foreground">Manage company profiles, interview data, and salary insights</p>
        </div>
        <Button>Add Company</Button>
      </div>

      <Separator className="my-6" />

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Company</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Questions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Experiences</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Salaries</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{company.name}</td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[company.status] ?? ""}>{company.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm">{company._count.questions}</td>
                <td className="px-6 py-4 text-sm">{company._count.experiences}</td>
                <td className="px-6 py-4 text-sm">{company._count.salaryInsights}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
            {!companies.length && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No company records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
