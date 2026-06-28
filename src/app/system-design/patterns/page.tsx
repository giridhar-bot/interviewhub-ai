import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateSEO } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/json-ld";

export const metadata = generateSEO({
  title: "Design Patterns — GoF & Software Architecture Patterns",
  description:
    "Learn Gang of Four design patterns, architectural patterns, and software engineering best practices. Creational, structural, and behavioral patterns with examples.",
  path: "/system-design/patterns",
  keywords: ["design patterns", "GoF", "software architecture", "creational patterns", "behavioral patterns"],
});

const patternCategories = [
  {
    category: "Creational",
    color: "from-green-500 to-emerald-500",
    patterns: [
      { name: "Singleton", slug: "singleton", description: "Ensure a class has only one instance" },
      { name: "Factory Method", slug: "factory-method", description: "Create objects without specifying the exact class" },
      { name: "Abstract Factory", slug: "abstract-factory", description: "Create families of related objects" },
      { name: "Builder", slug: "builder", description: "Construct complex objects step by step" },
      { name: "Prototype", slug: "prototype", description: "Clone existing objects without coupling" },
    ],
  },
  {
    category: "Structural",
    color: "from-blue-500 to-cyan-500",
    patterns: [
      { name: "Adapter", slug: "adapter", description: "Make incompatible interfaces work together" },
      { name: "Decorator", slug: "decorator", description: "Add responsibilities dynamically" },
      { name: "Facade", slug: "facade", description: "Simplified interface to a complex subsystem" },
      { name: "Proxy", slug: "proxy", description: "Provide a placeholder for another object" },
      { name: "Composite", slug: "composite", description: "Compose objects into tree structures" },
    ],
  },
  {
    category: "Behavioral",
    color: "from-violet-500 to-purple-500",
    patterns: [
      { name: "Observer", slug: "observer", description: "Notify dependents of state changes" },
      { name: "Strategy", slug: "strategy", description: "Define a family of algorithms" },
      { name: "Command", slug: "command", description: "Encapsulate a request as an object" },
      { name: "State", slug: "state", description: "Alter behavior when internal state changes" },
      { name: "Template Method", slug: "template-method", description: "Define the skeleton of an algorithm" },
    ],
  },
  {
    category: "Architectural",
    color: "from-orange-500 to-red-500",
    patterns: [
      { name: "MVC", slug: "mvc", description: "Model-View-Controller separation" },
      { name: "Microservices", slug: "microservices", description: "Independent, deployable services" },
      { name: "Event-Driven", slug: "event-driven", description: "Components communicate via events" },
      { name: "CQRS", slug: "cqrs", description: "Separate read and write models" },
      { name: "Repository", slug: "repository", description: "Abstract data access layer" },
    ],
  },
];

export default function DesignPatternsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "System Design", href: "/system-design" },
              { name: "Patterns", href: "/system-design/patterns" },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Design{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Patterns
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Master the essential design patterns every software engineer should know.
          From GoF classics to modern architectural patterns.
        </p>
      </div>

      <div className="mt-16 space-y-12">
        {patternCategories.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-3">
              <div className={`h-1 w-12 rounded bg-gradient-to-r ${cat.color}`} />
              <h2 className="text-2xl font-bold">{cat.category} Patterns</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.patterns.map((p) => (
                <Link key={p.slug} href={`/system-design/${p.slug}`}>
                  <Card className="h-full cursor-pointer transition-all hover:shadow-md hover:border-violet-200">
                    <CardHeader>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <CardDescription>{p.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
