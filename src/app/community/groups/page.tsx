import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { generateSEO } from "@/lib/seo";
import { getStudyGroups } from "@/services/community.service";

export const metadata = generateSEO({
  title: "Study Groups — Learn Together",
  description: "Browse study groups created by the InterviewHub community.",
  path: "/community/groups",
  keywords: ["study groups", "peer learning", "interview preparation"],
});

export const dynamic = "force-dynamic";

export default async function StudyGroupsPage() {
  const groups = await getStudyGroups();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Study Groups", href: "/community/groups" },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Study Groups</h1>
          <p className="mt-1 text-muted-foreground">Groups created by community members.</p>
        </div>
        <Button>Create Group</Button>
      </div>

      {groups.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{group.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {group._count.members} members
                  </Badge>
                </div>
                {group.description && <CardDescription>{group.description}</CardDescription>}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Created by {group.owner.displayName ?? "Community member"} · {group.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                  </span>
                  <Button size="sm" variant="outline" disabled>Join</Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No study groups have been created yet.
        </p>
      )}
    </div>
  );
}