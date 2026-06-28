import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { breadcrumbJsonLd, courseJsonLd, faqPageJsonLd } from "@/lib/json-ld";

const topicData: Record<
  string,
  { name: string; description: string; category: string }
> = {
  java: { name: "Java", description: "Core Java, Collections, Multithreading, JVM, OOP concepts and more", category: "Backend" },
  "spring-boot": { name: "Spring Boot", description: "Spring Framework, REST APIs, Microservices, Security, JPA and more", category: "Backend" },
  "node-js": { name: "Node.js", description: "Event loop, Express, async programming, streams and more", category: "Backend" },
  "net": { name: ".NET", description: "C#, ASP.NET Core, Entity Framework, LINQ and more", category: "Backend" },
  python: { name: "Python", description: "Data structures, Django, Flask, async, decorators and more", category: "Backend" },
  go: { name: "Go", description: "Goroutines, channels, interfaces, concurrency patterns and more", category: "Backend" },
  react: { name: "React", description: "Hooks, state management, performance, Next.js and more", category: "Frontend" },
  angular: { name: "Angular", description: "Components, RxJS, NgRx, routing, forms and more", category: "Frontend" },
  vue: { name: "Vue", description: "Composition API, Vuex, Pinia, Nuxt.js and more", category: "Frontend" },
  javascript: { name: "JavaScript", description: "Closures, prototypes, event loop, ES6+, promises and more", category: "Frontend" },
  typescript: { name: "TypeScript", description: "Types, generics, decorators, utility types and more", category: "Frontend" },
  aws: { name: "AWS", description: "EC2, S3, Lambda, DynamoDB, CloudFormation and more", category: "Cloud & DevOps" },
  azure: { name: "Azure", description: "App Services, Functions, CosmosDB, AKS and more", category: "Cloud & DevOps" },
  gcp: { name: "GCP", description: "Compute Engine, Cloud Functions, BigQuery and more", category: "Cloud & DevOps" },
  docker: { name: "Docker", description: "Containers, images, compose, networking and more", category: "Cloud & DevOps" },
  kubernetes: { name: "Kubernetes", description: "Pods, services, deployments, Helm, operators and more", category: "Cloud & DevOps" },
  terraform: { name: "Terraform", description: "IaC, providers, modules, state management and more", category: "Cloud & DevOps" },
  sap: { name: "SAP", description: "ABAP, FICO, MM, SD, Basis, HANA and more", category: "Enterprise" },
  salesforce: { name: "Salesforce", description: "Apex, Lightning, Flows, integrations and more", category: "Enterprise" },
  servicenow: { name: "ServiceNow", description: "ITSM, scripting, workflows, integrations and more", category: "Enterprise" },
  sql: { name: "SQL", description: "Joins, indexing, query optimization, stored procedures and more", category: "Data" },
  "data-engineering": { name: "Data Engineering", description: "ETL, pipelines, Spark, Kafka and more", category: "Data" },
  "power-bi": { name: "Power BI", description: "DAX, data modeling, visualizations and more", category: "Data" },
  snowflake: { name: "Snowflake", description: "Warehousing, queries, time-travel and more", category: "Data" },
  databricks: { name: "Databricks", description: "Spark, Delta Lake, MLflow and more", category: "Data" },
};

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicData[slug];
  if (!topic) return { title: "Topic Not Found" };
  return {
    title: `${topic.name} Interview Questions, Notes & Roadmap`,
    description: `Prepare for ${topic.name} interviews with curated questions, notes, roadmaps and cheat sheets. ${topic.description}`,
    keywords: [
      `${topic.name} interview questions`,
      `${topic.name} notes`,
      `${topic.name} roadmap`,
      `${topic.name} cheat sheet`,
      `${topic.name} tutorial`,
    ],
    openGraph: {
      title: `${topic.name} Interview Questions, Notes & Roadmap`,
      description: `Prepare for ${topic.name} interviews with curated questions, notes, roadmaps and cheat sheets.`,
      url: `https://interviewhub.ai/topics/${slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://interviewhub.ai/topics/${slug}`,
    },
  };
}

const tabContent = [
  { value: "questions", label: "Interview Questions", count: "150+" },
  { value: "notes", label: "Notes", count: "50+" },
  { value: "roadmap", label: "Roadmap", count: "1" },
  { value: "cheatsheet", label: "Cheat Sheet", count: "5+" },
];

export default async function TopicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const topic = topicData[slug];

  if (!topic) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", href: "/" },
            { name: "Topics", href: "/topics" },
            { name: topic.name, href: `/topics/${slug}` },
          ])),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseJsonLd({
            title: `${topic.name} Interview Preparation`,
            description: topic.description,
            slug,
          })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd([
            { question: `What are common ${topic.name} interview questions?`, answer: `Common ${topic.name} interview questions cover ${topic.description}. Practice with our curated question bank.` },
            { question: `How to prepare for ${topic.name} interviews?`, answer: `Start with our ${topic.name} roadmap, study the notes, practice coding problems, and use cheat sheets for quick revision.` },
          ])),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span>/</span>
        <Link href="/topics" className="hover:text-foreground">
          Topics
        </Link>
        <span>/</span>
        <span className="text-foreground">{topic.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {topic.name}
            </h1>
            <Badge variant="secondary">{topic.category}</Badge>
          </div>
          <p className="mt-2 text-lg text-muted-foreground">
            {topic.description}
          </p>
        </div>
        <Button className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          Start Learning
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="questions" className="mt-12">
        <TabsList className="grid w-full grid-cols-4">
          {tabContent.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabContent.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="cursor-pointer transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        {["Easy", "Medium", "Hard"][i % 3]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        #{i + 1}
                      </span>
                    </div>
                    <CardTitle className="text-base mt-2">
                      {tab.value === "questions"
                        ? `${topic.name} ${tab.label.slice(0, -1)} ${i + 1}`
                        : `${topic.name} ${tab.label} ${i + 1}`}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Sample content for {topic.name} {tab.label.toLowerCase()}.
                      This will be replaced with real content.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" className="rounded-full px-8">
                View All {tab.count} {tab.label}
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
