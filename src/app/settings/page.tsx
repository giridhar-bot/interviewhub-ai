import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your account settings and preferences
      </p>

      <Separator className="my-6" />

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <Input id="name" defaultValue="Girdhar Kumar" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" defaultValue="girdhar@example.com" className="mt-1" disabled />
            </div>
          </div>
          <Button className="bg-brand-gradient text-white">Save Changes</Button>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive weekly progress reports</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Daily Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminded to practice daily</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="mt-6 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
