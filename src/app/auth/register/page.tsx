import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthForm } from "@/features/auth/auth-form";
import { getEnabledOAuthProviders } from "@/config/auth-providers";
import { generateSEO } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = generateSEO({
  title: "Sign Up",
  description: "Create your free InterviewHub AI account and start preparing.",
  path: "/auth/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-2 px-6 text-center">
          <CardTitle>
            <h1 className="text-2xl font-bold">Create your account</h1>
          </CardTitle>
          <CardDescription>Start your interview preparation journey for free</CardDescription>
        </CardHeader>
        <AuthForm mode="register" providers={getEnabledOAuthProviders()} />
      </Card>
    </div>
  );
}
