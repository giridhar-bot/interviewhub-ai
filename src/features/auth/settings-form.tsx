"use client";

import { useActionState } from "react";
import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveSettings } from "./settings-actions";
import { Select } from "@/components/ui/select";
import Link from "next/link";

export function SettingsForm({
  profile,
}: {
  profile: { displayName: string; email: string; bio: string; timezone: string };
}) {
  const [state, action, pending] = useActionState(saveSettings, { error: "", message: "" });
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="displayName" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={profile.displayName}
                  required
                  minLength={2}
                  maxLength={100}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="settings-email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="settings-email" value={profile.email} readOnly className="h-11" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <TextArea id="bio" name="bio" defaultValue={profile.bio} maxLength={1000} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="timezone" className="text-sm font-medium">
                Timezone
              </label>
              <Input
                id="timezone"
                name="timezone"
                defaultValue={profile.timezone}
                required
                placeholder="Asia/Kolkata"
                className="h-11"
              />
            </div>
            {state.error && (
              <p role="alert" className="text-sm text-destructive">
                {state.error}
              </p>
            )}
            {state.message && (
              <p role="status" className="text-sm text-success">
                {state.message}
              </p>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Your theme preference is saved on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            id="settings-theme"
            label="Theme"
            value={theme ?? "system"}
            onChange={(event) => setTheme(event.target.value)}
            options={[
              { label: "System", value: "system" },
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account security</CardTitle>
          <CardDescription>Reset your password using a link sent to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/forgot-password">
            <Button variant="outline">Reset password</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
