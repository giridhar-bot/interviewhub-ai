import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";
import { adminRepository } from "@/repositories/admin.repository";

export const metadata = generateSEO({
  title: "Content Moderation — Admin",
  description: "Review and moderate queued content and user reports.",
  path: "/admin/moderation",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const typeColors: Record<string, string> = {
  post: "bg-violet-50 text-violet-600",
  comment: "bg-orange-50 text-orange-600",
  experience: "bg-blue-50 text-blue-600",
};

export default async function AdminModerationPage() {
  const [queue, pendingReports, reviewedReports, resolvedReports] = await Promise.all([
    adminRepository.getModerationQueue(1, 50),
    adminRepository.getReports("PENDING", 1, 1),
    adminRepository.getReports("REVIEWED", 1, 1),
    adminRepository.getReports("RESOLVED", 1, 1),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Content Moderation</h1>
          <p className="mt-1 text-muted-foreground">Review and moderate user-generated content</p>
        </div>
        <Badge variant="secondary" className="px-4 py-1 text-lg">{queue.total} Pending</Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Open Queue", value: queue.total, color: "text-yellow-600" },
          { label: "Pending Reports", value: pendingReports.total, color: "text-orange-600" },
          { label: "Reviewed Reports", value: reviewedReports.total, color: "text-blue-600" },
          { label: "Resolved Reports", value: resolvedReports.total, color: "text-green-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className={`text-2xl ${stat.color}`}>{stat.value.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        {queue.items.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className={typeColors[item.entityType.toLowerCase()] ?? ""}>{item.entityType}</Badge>
                  <CardTitle className="text-base">{item.entityId}</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  {item.reason} · Priority {item.priority} · {item.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-green-600 border-green-200">Approve</Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200">Reject</Button>
              </div>
            </CardHeader>
          </Card>
        ))}
        {!queue.items.length && (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No items are waiting in the moderation queue.
          </p>
        )}
      </div>
    </div>
  );
}