import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Content Moderation — Admin",
  description: "Review and moderate user-generated content.",
  path: "/admin/moderation",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const pendingItems = [
  { id: 1, type: "Experience", title: "Google SDE-1 Interview Experience", author: "Anonymous User", reportedAt: "2 hours ago", reason: "Pending Review" },
  { id: 2, type: "Comment", title: "Inappropriate comment on 'Two Sum'", author: "user123", reportedAt: "5 hours ago", reason: "Reported: Spam" },
  { id: 3, type: "Experience", title: "Amazon SDE-2 Interview Experience", author: "Anonymous User", reportedAt: "1 day ago", reason: "Pending Review" },
  { id: 4, type: "Post", title: "Misleading salary information", author: "user456", reportedAt: "1 day ago", reason: "Reported: Misleading" },
  { id: 5, type: "Comment", title: "Abusive language in discussion", author: "user789", reportedAt: "2 days ago", reason: "Reported: Abuse" },
];

const typeColors: Record<string, string> = {
  Experience: "bg-blue-50 text-blue-600",
  Comment: "bg-orange-50 text-orange-600",
  Post: "bg-purple-50 text-purple-600",
};

export default function AdminModerationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Content Moderation</h1>
          <p className="mt-1 text-muted-foreground">Review and moderate user-generated content</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-1">
          {pendingItems.length} Pending
        </Badge>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {[
          { label: "Pending Review", value: "5", color: "text-yellow-600" },
          { label: "Approved Today", value: "12", color: "text-green-600" },
          { label: "Rejected Today", value: "3", color: "text-red-600" },
          { label: "Total Reports", value: "45", color: "text-blue-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className={`text-2xl ${s.color}`}>{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Moderation Queue */}
      <div className="space-y-4">
        {pendingItems.map((item) => (
          <Card key={item.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-start gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={typeColors[item.type]}>{item.type}</Badge>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    By {item.author} • {item.reportedAt} • {item.reason}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-green-600 border-green-200">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200">
                  Reject
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
