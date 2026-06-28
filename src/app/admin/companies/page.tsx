import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Company Management — Admin",
  description: "Manage company profiles, questions, and experiences.",
  path: "/admin/companies",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const sampleCompanies = [
  { name: "Google", status: "Published", questions: 120, experiences: 45, salaries: 80 },
  { name: "Amazon", status: "Published", questions: 150, experiences: 62, salaries: 95 },
  { name: "Microsoft", status: "Published", questions: 95, experiences: 38, salaries: 70 },
  { name: "Meta", status: "Published", questions: 88, experiences: 30, salaries: 55 },
  { name: "Apple", status: "Draft", questions: 45, experiences: 15, salaries: 30 },
];

const statusColors: Record<string, string> = {
  Published: "bg-green-50 text-green-600",
  Draft: "bg-yellow-50 text-yellow-600",
};

export default function AdminCompaniesPage() {
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
            {sampleCompanies.map((c) => (
              <tr key={c.name} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4">
                  <Badge className={statusColors[c.status]}>{c.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm">{c.questions}</td>
                <td className="px-6 py-4 text-sm">{c.experiences}</td>
                <td className="px-6 py-4 text-sm">{c.salaries}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
