import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Resume Builder & ATS Checker — Create ATS-Friendly Resumes",
  description:
    "Build professional, ATS-optimized resumes with AI assistance. Choose from templates, get ATS scores, and optimize for specific companies.",
  path: "/resume",
  keywords: ["resume builder", "ATS checker", "ATS score", "resume templates", "AI resume"],
});

const features = [
  {
    title: "Resume Builder",
    description: "Create professional resumes with drag-and-drop editor and real-time preview.",
    href: "/resume/builder",
    badge: "Interactive",
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "ATS Checker",
    description: "Get your ATS compatibility score and detailed improvement suggestions.",
    href: "/resume/builder",
    badge: "AI-Powered",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Templates",
    description: "Choose from 10+ professional templates optimized for different industries.",
    href: "/resume/templates",
    badge: "10+ Templates",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI Review",
    description: "Get AI-powered feedback on content, formatting, and STAR format compliance.",
    href: "/resume/builder",
    badge: "Smart",
    color: "from-orange-500 to-red-500",
  },
];

const stats = [
  { label: "Resumes Created", value: "10K+" },
  { label: "Avg ATS Score", value: "85%" },
  { label: "Templates", value: "12" },
  { label: "Job Offers", value: "2.5K+" },
];

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Resume", href: "/resume" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Resume{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Builder
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Create ATS-friendly resumes that get you past automated screening and land interviews.
          AI-powered optimization for maximum impact.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/resume/builder">
            <Button size="lg">Create Resume</Button>
          </Link>
          <Link href="/resume/templates">
            <Button size="lg" variant="outline">Browse Templates</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid grid-cols-4 gap-4 rounded-2xl border bg-card p-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-bold text-violet-600">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {features.map((f) => (
          <Link key={f.title} href={f.href}>
            <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:border-violet-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                  <Badge variant="secondary">{f.badge}</Badge>
                </div>
                <CardDescription className="mt-2 text-base">{f.description}</CardDescription>
                <div className={`mt-4 h-1 w-16 rounded bg-gradient-to-r ${f.color}`} />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold">How It Works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { step: 1, title: "Choose Template", desc: "Pick from professional, modern, or minimal designs" },
            { step: 2, title: "Add Content", desc: "Fill in your experience, skills, and projects with AI assistance" },
            { step: 3, title: "Optimize & Download", desc: "Get ATS score, optimize content, and export as PDF" },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-lg font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
