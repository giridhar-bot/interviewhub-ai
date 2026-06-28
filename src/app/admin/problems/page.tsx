import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Problem Management — Admin",
  description: "Manage coding problems, test cases, and solutions.",
  path: "/admin/problems",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const sampleProblems = [
  { title: "Two Sum", difficulty: "Easy", category: "Arrays", submissions: 12500, acceptance: "49%", status: "Published" },
  { title: "LRU Cache", difficulty: "Medium", category: "Design", submissions: 8200, acceptance: "42%", status: "Published" },
  { title: "Merge K Sorted Lists", difficulty: "Hard", category: "Linked List", submissions: 5600, acceptance: "48%", status: "Published" },
  { title: "Longest Substring", difficulty: "Medium", category: "Strings", submissions: 9800, acceptance: "33%", status: "Published" },
  { title: "New Problem Draft", difficulty: "Medium", category: "Trees", submissions: 0, acceptance: "0%", status: "Draft" },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default function AdminProblemsPage() {
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
          { label: "Total Problems", value: "500" },
          { label: "Easy", value: "150" },
          { label: "Medium", value: "250" },
          { label: "Hard", value: "100" },
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
              <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleProblems.map((p) => (
              <tr key={p.title} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{p.title}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColors[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{p.category}</td>
                <td className="px-6 py-4 text-sm">{p.submissions.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">{p.acceptance}</td>
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
