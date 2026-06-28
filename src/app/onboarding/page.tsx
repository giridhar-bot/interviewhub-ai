import { requireAuth } from "@/lib/auth-guard";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile",
  description: "Set up your InterviewHub AI profile to get personalized recommendations.",
};

export default async function OnboardingPage() {
  const user = await requireAuth();

  // If profile is already complete, skip to dashboard
  if (user.profileComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to InterviewHub AI! 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          Let&apos;s set up your profile to personalize your experience.
        </p>
      </div>
      <OnboardingForm userId={user.id} email={user.email} />
    </div>
  );
}
