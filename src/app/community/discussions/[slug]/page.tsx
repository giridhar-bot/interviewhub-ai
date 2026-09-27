import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { generateSEO } from "@/lib/seo";
import { communityRepository } from "@/repositories/community.repository";
import { getPost } from "@/services/community.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await communityRepository.findPostBySlug(slug);

  return generateSEO({
    title: post ? `${post.title} — Community Discussion` : "Discussion Not Found",
    description: post?.content.slice(0, 160) ?? "Read published community discussions.",
    path: `/community/discussions/${slug}`,
  });
}

export default async function DiscussionDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Community", href: "/community" },
              { name: "Discussions", href: "/community/discussions" },
              { name: post.title, href: `/community/discussions/${slug}` },
            ])
          ),
        }}
      />

      <article>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Discussion</Badge>
          {post.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>by {post.author?.name ?? "Community member"}</span>
          <span>{post.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}</span>
          <span>{post._count.comments} replies</span>
          <span>{post.views.toLocaleString()} views</span>
        </div>

        <Separator className="my-6" />

        <div className="whitespace-pre-wrap text-sm leading-7">{post.content}</div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="sm">Votes ({post._count.votes})</Button>
          <Button variant="outline" size="sm">Bookmark</Button>
          <Button variant="outline" size="sm">Share</Button>
        </div>
      </article>

      <Separator className="my-8" />

      <section>
        <h2 className="text-xl font-bold">Replies ({post._count.comments})</h2>
        <Card className="mt-4">
          <CardHeader>
            <div className="min-h-20 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
              Write your reply...
            </div>
            <div className="mt-2 flex justify-end">
              <Button size="sm">Post Reply</Button>
            </div>
          </CardHeader>
        </Card>

        {post.comments.length ? (
          <div className="mt-6 space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {(comment.author?.name ?? "U")[0]}
                    </div>
                    <span className="text-sm font-medium">{comment.author?.name ?? "Community member"}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Votes: {comment._count.votes}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{comment.content}</p>
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="ml-8 mt-4 border-l pl-4">
                    <div className="text-sm font-medium">{reply.author?.name ?? "Community member"}</div>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No replies yet.
          </p>
        )}
      </section>
    </div>
  );
}