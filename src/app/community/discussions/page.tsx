import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { getPosts } from "@/services/community.service";

export const metadata = generateSEO({
  title: "Community Discussions — Ask, Share & Learn Together",
  description: "Browse and search published community discussions.",
  path: "/community/discussions",
  keywords: ["tech discussions", "developer community", "interview tips", "career advice"],
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ sort?: string | string[]; tag?: string | string[] }>;
type SortOrder = "latest" | "popular" | "unanswered";

function resolveSort(value?: string | string[]): SortOrder {
  const sort = Array.isArray(value) ? value[0] : value;
  return sort === "popular" || sort === "unanswered" ? sort : "latest";
}

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const sort = resolveSort(params.sort);
  const tag = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  const [result, tagSource] = await Promise.all([
    getPosts({ sort, tag, limit: 30 }),
    getPosts({ sort: "popular", limit: 100 }),
  ]);

  const tagCounts = new Map<string, number>();
  for (const post of tagSource.posts) {
    for (const postTag of post.tags) {
      tagCounts.set(postTag, (tagCounts.get(postTag) ?? 0) + 1);
    }
  }
  const trendingTags = Array.from(tagCounts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([name]) => name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Discussions", href: "/community/discussions" },
            ])
          ),
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Community Discussions</h1>
          <p className="mt-1 text-muted-foreground">{result.total} published discussions</p>
        </div>
        <Link href="/community/ask"><Button>Start Discussion</Button></Link>
      </div>

      {trendingTags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {trendingTags.map((postTag) => (
            <Link key={postTag} href={`/community/discussions?tag=${encodeURIComponent(postTag)}`}>
              <Badge variant={tag === postTag ? "default" : "outline"}>#{postTag}</Badge>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 flex gap-2">
        {(["latest", "popular", "unanswered"] as const).map((sortOption) => (
          <Link key={sortOption} href={`/community/discussions?sort=${sortOption}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}>
            <Badge variant={sort === sortOption ? "default" : "outline"}>
              {sortOption[0].toUpperCase() + sortOption.slice(1)}
            </Badge>
          </Link>
        ))}
      </div>

      {result.posts.length ? (
        <div className="mt-6 space-y-3">
          {result.posts.map((post) => (
            <Link key={post.id} href={`/community/discussions/${post.slug}`}>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <CardDescription className="mt-1">
                      by {post.author?.name ?? "Community member"} · {post.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                    </CardDescription>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.map((postTag) => <Badge key={postTag} variant="secondary" className="text-xs">{postTag}</Badge>)}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{post._count.comments} replies</span>
                    <span>{post._count.votes} votes</span>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          No published discussions match this filter.
        </p>
      )}
    </div>
  );
}