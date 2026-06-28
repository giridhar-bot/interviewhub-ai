import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "System Design — HLD, LLD & Architecture",
  description:
    "Master system design interviews with HLD, LLD, architecture patterns, and real-world case studies. Design scalable systems like URL shortener, chat apps, and more.",
  path: "/system-design",
  keywords: ["system design", "HLD", "LLD", "architecture", "scalability", "system design interview", "microservices"],
});

const systemDesignTopics = [
  {
    title: "URL Shortener",
    description: "Design a URL shortening service like Bit.ly",
    difficulty: "Medium",
    category: "HLD",
  },
  {
    title: "Chat Application",
    description: "Design a real-time messaging system like WhatsApp",
    difficulty: "Hard",
    category: "HLD",
  },
  {
    title: "E-Commerce Platform",
    description: "Design a scalable e-commerce platform like Amazon",
    difficulty: "Hard",
    category: "HLD",
  },
  {
    title: "Rate Limiter",
    description: "Design an API rate limiter with multiple algorithms",
    difficulty: "Medium",
    category: "HLD",
  },
  {
    title: "Notification System",
    description: "Design a push notification service at scale",
    difficulty: "Medium",
    category: "HLD",
  },
  {
    title: "Video Streaming",
    description: "Design a video streaming platform like YouTube",
    difficulty: "Hard",
    category: "HLD",
  },
  {
    title: "Parking Lot System",
    description: "Design classes and relationships for a parking lot",
    difficulty: "Easy",
    category: "LLD",
  },
  {
    title: "Elevator System",
    description: "Design an elevator management system with OOP",
    difficulty: "Medium",
    category: "LLD",
  },
  {
    title: "Library Management",
    description: "Design a library management system with all operations",
    difficulty: "Easy",
    category: "LLD",
  },
];

const concepts = [
  "Load Balancing",
  "Caching Strategies",
  "Database Sharding",
  "CAP Theorem",
  "Microservices",
  "Event-Driven Architecture",
  "Message Queues",
  "API Gateway",
  "CQRS Pattern",
  "Circuit Breaker",
  "CDN",
  "Consistent Hashing",
];

const difficultyColors: Record<string, string> = {
  Easy: "text-green-600 bg-green-50",
  Medium: "text-yellow-600 bg-yellow-50",
  Hard: "text-red-600 bg-red-50",
};

export default function SystemDesignPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          System{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Design
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Master High-Level Design (HLD), Low-Level Design (LLD), and
          architecture patterns for senior-level interviews.
        </p>
      </div>

      {/* Concepts */}
      <div className="mt-12">
        <h2 className="text-xl font-bold">Key Concepts</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {concepts.map((concept) => (
            <Badge
              key={concept}
              variant="outline"
              className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-violet-50 hover:border-violet-300"
            >
              {concept}
            </Badge>
          ))}
        </div>
      </div>

      {/* Problems */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Design Problems</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemDesignTopics.map((topic) => (
            <Link
              key={topic.title}
              href={`/system-design/${topic.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Card className="group h-full cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{topic.category}</Badge>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        difficultyColors[topic.difficulty]
                      }`}
                    >
                      {topic.difficulty}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-lg group-hover:text-violet-600">
                    {topic.title}
                  </CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
