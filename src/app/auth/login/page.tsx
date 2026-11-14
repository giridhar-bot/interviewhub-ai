import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthForm } from "@/features/auth/auth-form";
import { getEnabledOAuthProviders } from "@/config/auth-providers";
import { generateSEO } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = generateSEO({
  title: "Log In",
  description: "Log in to your InterviewHub AI account.",
  path: "/auth/login",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-2 px-6 text-center">
          <CardTitle>
            <h1 className="text-2xl font-bold">Welcome back</h1>
          </CardTitle>
          <CardDescription>Log in to continue your interview preparation</CardDescription>
        </CardHeader>
        <AuthForm
          mode="login"
          providers={getEnabledOAuthProviders()}
          registered={registered === "1"}
        />
      </Card>
    </div>
  );
}
