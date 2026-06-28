import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Ask a Question — Community",
  description: "Ask a question to the InterviewHub AI community. Get answers from experienced engineers.",
  path: "/community/ask",
  noIndex: true,
});

export default function AskQuestionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Start a{" "}
        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Discussion
        </span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Ask a question, share an experience, or start a conversation.
      </p>

      <Separator className="my-6" />

      <div className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="text-sm font-medium">Type</label>
          <div className="mt-2 flex gap-2">
            {["Discussion", "Question", "Experience", "Resource"].map((type) => (
              <Button
                key={type}
                variant={type === "Discussion" ? "default" : "outline"}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium">Title</label>
          <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            Enter a descriptive title...
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium">Content</label>
          <div className="mt-1 h-64 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            Write your post in Markdown... Supports code blocks, images, and formatting.
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Supports Markdown formatting, code blocks with syntax highlighting, and image embeds.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium">Tags</label>
          <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            Add tags (e.g., DSA, Google, System Design)...
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Add up to 5 relevant tags to help others find your post.
          </p>
        </div>

        {/* Company (for experiences) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Interview Experience Fields</CardTitle>
            <CardDescription>Only shown for experience posts</CardDescription>
          </CardHeader>
          <div className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium">Company</label>
              <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                Select company...
              </div>
            </div>
            <div>
              <label className="text-xs font-medium">Role</label>
              <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                e.g. SDE-1, SDE-2...
              </div>
            </div>
            <div>
              <label className="text-xs font-medium">Outcome</label>
              <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                Selected / Rejected / In Progress
              </div>
            </div>
            <div>
              <label className="text-xs font-medium">Rounds</label>
              <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                Number of rounds
              </div>
            </div>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish Post</Button>
        </div>
      </div>
    </div>
  );
}
