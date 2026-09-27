import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSEO } from "@/lib/seo";
import { getInterviewExperiences, getPosts } from "@/services/community.service";
import Link from "next/link";

export const metadata = generateSEO({
  title: "Community — Discussions & Interview Experiences",
  description: "Read published community discussions and interview experiences.",
  path: "/community",
  keywords: ["interview experience", "tech interview discussion", "interview community"],
});

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const [discussionResult, experiences] = await Promise.all([
    getPosts({ limit: 5, sort: "popular" }),
    getInterviewExperiences(5),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Community</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Published discussions and interview experiences from the community.
        </p>
      </div>

      <Tabs defaultValue="discussions" className="mt-12">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="experiences">Interview Experiences</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="mt-8">
          {discussionResult.posts.length ? (
            <div className="space-y-4">
              {discussionResult.posts.map((post) => (
                <Link key={post.id} href={`/community/discussions/${post.slug}`}>
                  <Card className="transition-all hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base hover:text-primary">{post.title}</CardTitle>
                      <CardDescription>
                        by {post.author?.name ?? "Community member"} · {post.createdAt.toLocaleDateString("en", { dateStyle: "medium" })}
                      </CardDescription>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
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
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No published discussions yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="experiences" className="mt-8">
          {experiences.length ? (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <Card key={experience.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <CardTitle className="text-base">{experience.company.name} — {experience.role}</CardTitle>
                      <Badge variant="outline">{experience.result.replace(/_/g, " ")}</Badge>
                    </div>
                    <CardDescription>
                      by {experience.author?.name ?? "Community member"} · {experience.createdAt.toLocaleDateString("en", { dateStyle: "medium" })} · {experience.rounds} rounds
                    </CardDescription>
                    <p className="line-clamp-3 text-sm">{experience.content}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No published interview experiences yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}