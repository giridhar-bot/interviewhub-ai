import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "System Settings — Admin",
  description: "Configure platform settings, feature flags, and system preferences.",
  path: "/admin/settings",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const settings = [
  { category: "General", items: [
    { name: "Site Name", value: "InterviewHub AI", type: "text" },
    { name: "Support Email", value: "support@interviewhub.ai", type: "text" },
    { name: "Maintenance Mode", value: "Off", type: "toggle" },
  ]},
  { category: "Authentication", items: [
    { name: "Google OAuth", value: "Enabled", type: "toggle" },
    { name: "GitHub OAuth", value: "Enabled", type: "toggle" },
    { name: "Email/Password", value: "Enabled", type: "toggle" },
    { name: "Magic Link", value: "Enabled", type: "toggle" },
  ]},
  { category: "AI Configuration", items: [
    { name: "Default AI Model", value: "GPT-4o", type: "select" },
    { name: "Max Tokens per Request", value: "4096", type: "number" },
    { name: "AI Safety Filter", value: "Enabled", type: "toggle" },
    { name: "Rate Limit (req/min)", value: "20", type: "number" },
  ]},
  { category: "Content", items: [
    { name: "Auto-publish Approved Content", value: "Enabled", type: "toggle" },
    { name: "Require Moderation", value: "User Content Only", type: "select" },
    { name: "Max Upload Size", value: "10 MB", type: "text" },
  ]},
];

const featureFlags = [
  { name: "coding_contests", label: "Coding Contests", enabled: true, description: "Enable weekly coding contests" },
  { name: "ai_mock_interview", label: "AI Mock Interview", enabled: true, description: "AI-powered mock interviews" },
  { name: "resume_builder", label: "Resume Builder", enabled: true, description: "Interactive resume builder" },
  { name: "salary_insights", label: "Salary Insights", enabled: true, description: "Anonymous salary data" },
  { name: "dark_mode", label: "Dark Mode", enabled: true, description: "Dark theme support" },
  { name: "notifications", label: "Push Notifications", enabled: false, description: "Browser push notifications" },
  { name: "community_posts", label: "Community Posts", enabled: false, description: "User community forum" },
];

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
          <p className="mt-1 text-muted-foreground">Configure platform settings and feature flags</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <Separator className="my-6" />

      {/* Settings Sections */}
      <div className="space-y-8">
        {settings.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle>{section.category}</CardTitle>
            </CardHeader>
            <div className="space-y-4 px-6 pb-6">
              {section.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    {item.type === "toggle" ? (
                      <Badge className={item.value === "Enabled" || item.value === "Off" && item.name === "Maintenance Mode" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}>
                        {item.value}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Feature Flags */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Feature Flags</h2>
        <Card className="mt-4">
          <div className="space-y-3 p-6">
            {featureFlags.map((flag) => (
              <div key={flag.name} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">{flag.label}</div>
                  <div className="text-xs text-muted-foreground">{flag.description}</div>
                </div>
                <Badge className={flag.enabled ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}>
                  {flag.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
