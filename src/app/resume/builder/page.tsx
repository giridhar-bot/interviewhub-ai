import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Resume Builder — Create Your Professional Resume",
  description:
    "Build your resume with our interactive editor. Add experience, skills, projects, and education. Get real-time ATS score and AI suggestions.",
  path: "/resume/builder",
  noIndex: true,
});

export default function ResumeBuilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Resume{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Builder
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Build your resume section by section. Preview in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button>Download PDF</Button>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Editor */}
        <div className="space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your name, contact details, and links</CardDescription>
            </CardHeader>
            <div className="space-y-4 px-6 pb-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                    Enter your name
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                    your@email.com
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                    +91 XXXXX XXXXX
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">LinkedIn</label>
                  <div className="mt-1 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                    linkedin.com/in/username
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>A brief overview of your experience and goals</CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="h-24 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                Write a 2-3 sentence professional summary...
              </div>
              <Button variant="outline" className="mt-2" size="sm">
                Generate with AI
              </Button>
            </div>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Your professional experience in reverse chronological order</CardDescription>
                </div>
                <Button size="sm">Add Experience</Button>
              </div>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
                No experiences added yet. Click &ldquo;Add Experience&rdquo; to start.
              </div>
            </div>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your academic background</CardDescription>
                </div>
                <Button size="sm">Add Education</Button>
              </div>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
                No education entries yet. Click &ldquo;Add Education&rdquo; to start.
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Technical and soft skills</CardDescription>
                </div>
                <Button size="sm">Add Skill</Button>
              </div>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="flex h-16 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
                No skills added yet
              </div>
            </div>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Notable projects you&apos;ve worked on</CardDescription>
                </div>
                <Button size="sm">Add Project</Button>
              </div>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed text-sm text-muted-foreground">
                No projects added yet
              </div>
            </div>
          </Card>
        </div>

        {/* Preview */}
        <div className="sticky top-4">
          <Card className="h-[800px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Live Preview</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  ATS Score: <span className="font-bold text-green-600">--</span>
                </div>
              </div>
            </CardHeader>
            <div className="flex h-full items-center justify-center px-6 pb-6">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Resume Preview</p>
                <p className="text-sm">Start adding content to see your resume</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
