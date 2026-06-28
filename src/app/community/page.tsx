import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Community — Discussions & Interview Experiences",
  description:
    "Share and read real interview experiences at Google, Amazon, Microsoft & more. Participate in discussions and learn from engineers worldwide.",
  path: "/community",
  keywords: ["interview experience", "tech interview discussion", "interview tips", "FAANG interview", "interview community"],
});

const discussions = [
  {
    title: "How I cracked Google L4 in 3 months",
    author: "Ankit S.",
    tags: ["Google", "System Design", "DSA"],
    replies: 42,
    likes: 156,
    time: "2h ago",
  },
  {
    title: "Spring Boot Microservices — best resources?",
    author: "Priya M.",
    tags: ["Spring Boot", "Microservices"],
    replies: 18,
    likes: 67,
    time: "5h ago",
  },
  {
    title: "SAP FICO interview experience at Deloitte",
    author: "Raj K.",
    tags: ["SAP", "FICO", "Deloitte"],
    replies: 12,
    likes: 89,
    time: "1d ago",
  },
  {
    title: "React vs Angular for 2026 — which one to learn?",
    author: "Neha G.",
    tags: ["React", "Angular", "Frontend"],
    replies: 56,
    likes: 203,
    time: "1d ago",
  },
  {
    title: "AWS Solutions Architect prep strategy",
    author: "Vikram T.",
    tags: ["AWS", "Cloud", "Certification"],
    replies: 24,
    likes: 112,
    time: "2d ago",
  },
];

const experiences = [
  {
    company: "Microsoft",
    role: "SDE-2",
    result: "Selected",
    rounds: 5,
    author: "Amit D.",
    date: "Jun 2026",
  },
  {
    company: "Amazon",
    role: "SDE-1",
    result: "Selected",
    rounds: 4,
    author: "Sneha R.",
    date: "Jun 2026",
  },
  {
    company: "Flipkart",
    role: "Backend Engineer",
    result: "Rejected",
    rounds: 3,
    author: "Rahul J.",
    date: "May 2026",
  },
  {
    company: "TCS",
    role: "SAP Consultant",
    result: "Selected",
    rounds: 3,
    author: "Deepak M.",
    date: "May 2026",
  },
  {
    company: "Infosys",
    role: "React Developer",
    result: "Selected",
    rounds: 4,
    author: "Kavitha N.",
    date: "May 2026",
  },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Community
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Learn from real interview experiences, join discussions, and grow
          together with fellow engineers.
        </p>
      </div>

      <Tabs defaultValue="discussions" className="mt-12">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="experiences">Interview Experiences</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="mt-8">
          <div className="space-y-4">
            {discussions.map((post) => (
              <Card
                key={post.title}
                className="cursor-pointer transition-all hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base hover:text-violet-600">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        by {post.author} · {post.time}
                      </CardDescription>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground shrink-0">
                      <span>{post.replies} replies</span>
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experiences" className="mt-8">
          <div className="space-y-4">
            {experiences.map((exp) => (
              <Card
                key={`${exp.company}-${exp.role}`}
                className="cursor-pointer transition-all hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {exp.company} — {exp.role}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        by {exp.author} · {exp.date} · {exp.rounds} rounds
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        exp.result === "Selected"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {exp.result}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
