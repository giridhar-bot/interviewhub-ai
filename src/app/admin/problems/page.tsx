import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";
import { adminRepository } from "@/repositories/admin.repository";

export const metadata = generateSEO({
  title: "Problem Management — Admin",
  description: "Manage coding problems, test cases, and solutions.",
  path: "/admin/problems",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const difficultyColors: Record<string, string> = {
  EASY: "text-green-600 bg-green-50",
  MEDIUM: "text-yellow-600 bg-yellow-50",
  HARD: "text-red-600 bg-red-50",
};

export default async function AdminProblemsPage() {
  const { problems, total, difficulties } = await adminRepository.getCodingProblemAdminData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Problem Management</h1>
          <p className="mt-1 text-muted-foreground">Create, edit, and manage coding problems and test cases</p>
        </div>
        <Button>Add Problem</Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: "Total Problems", value: total },
          { label: "Easy", value: difficulties.EASY },
          { label: "Medium", value: difficulties.MEDIUM },
          { label: "Hard", value: difficulties.HARD },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Problem</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Difficulty</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Submissions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Acceptance</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{problem.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{problem.category}</td>
                <td className="px-6 py-4 text-sm">{problem._count.submissions.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">{problem.acceptance.toFixed(1)}%</td>
                <td className="px-6 py-4 text-sm">{problem.status}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
            {!problems.length && (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No coding problems found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
