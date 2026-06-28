"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const TECH_STACKS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++",
  "Go", "Rust", "C#", "Ruby", "Swift", "Kotlin", "PHP",
];

const CAREER_GOALS = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "DevOps Engineer", "Data Scientist",
  "ML Engineer", "Mobile Developer", "Cloud Architect", "Tech Lead",
];

const EXPERIENCE_LEVELS = [
  { value: "student", label: "Student" },
  { value: "fresher", label: "Fresher (0-1 yrs)" },
  { value: "junior", label: "Junior (1-3 yrs)" },
  { value: "mid", label: "Mid-Level (3-5 yrs)" },
  { value: "senior", label: "Senior (5-10 yrs)" },
  { value: "staff", label: "Staff+ (10+ yrs)" },
];

export function OnboardingForm({ userId, email }: { userId: string; email: string }) {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    experience: "",
    careerGoal: "",
    techStack: [] as string[],
    targetCompanies: "",
  });

  const toggleTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Update session to reflect profile completion
      await update({
        username: formData.username,
        displayName: formData.displayName,
        profileComplete: true,
      });

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step {step} of 3</CardTitle>
        <CardDescription>
          {step === 1 && "Basic Information"}
          {step === 2 && "Your Experience"}
          {step === 3 && "Your Tech Stack"}
        </CardDescription>
      </CardHeader>

      <div className="px-6 pb-6 space-y-4">
        {step === 1 && (
          <>
            <div>
              <label className="text-sm font-medium" htmlFor="displayName">Display Name</label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData((p) => ({ ...p, displayName: (e.target as HTMLInputElement).value }))}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="username">Username</label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData((p) => ({ ...p, username: (e.target as HTMLInputElement).value }))}
                placeholder="unique_username"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">This will be your public profile URL</p>
            </div>
            <Button
              onClick={() => {
                if (!formData.displayName || !formData.username) {
                  setError("Please fill in all fields");
                  return;
                }
                setError("");
                setStep(2);
              }}
              className="w-full bg-brand-gradient text-white"
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="text-sm font-medium">Experience Level</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData((p) => ({ ...p, experience: level.value }))}
                    className={`rounded-lg border p-3 text-sm text-left transition-colors ${
                      formData.experience === level.value
                        ? "border-primary bg-primary/10 font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Career Goal</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CAREER_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setFormData((p) => ({ ...p, careerGoal: goal }))}
                    className={`rounded-lg border p-3 text-sm text-left transition-colors ${
                      formData.careerGoal === goal
                        ? "border-primary bg-primary/10 font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button
                onClick={() => {
                  if (!formData.experience || !formData.careerGoal) {
                    setError("Please select your experience and career goal");
                    return;
                  }
                  setError("");
                  setStep(3);
                }}
                className="flex-1 bg-brand-gradient text-white"
              >
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="text-sm font-medium">Select Your Tech Stack</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TECH_STACKS.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                      formData.techStack.includes(tech)
                        ? "border-primary bg-primary/10 font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="companies">Target Companies (optional)</label>
              <Input
                id="companies"
                value={formData.targetCompanies}
                onChange={(e) => setFormData((p) => ({ ...p, targetCompanies: (e.target as HTMLInputElement).value }))}
                placeholder="Google, Amazon, Microsoft..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || formData.techStack.length === 0}
                className="flex-1 bg-brand-gradient text-white"
              >
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
      </div>
    </Card>
  );
}
