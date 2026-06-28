import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error",
};

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  AccountBanned: {
    title: "Account Suspended",
    description: "Your account has been suspended. Please contact support for more information.",
  },
  AccountDeleted: {
    title: "Account Deleted",
    description: "This account has been deleted. If you believe this is an error, contact support.",
  },
  Configuration: {
    title: "Server Error",
    description: "There is a problem with the server configuration. Please try again later.",
  },
  AccessDenied: {
    title: "Access Denied",
    description: "You do not have permission to sign in.",
  },
  Verification: {
    title: "Verification Failed",
    description: "The verification link has expired or has already been used.",
  },
  Default: {
    title: "Authentication Error",
    description: "An error occurred during authentication. Please try again.",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorKey = params.error || "Default";
  const errorInfo = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.Default;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-5xl mb-4">⚠️</div>
          <CardTitle>{errorInfo.title}</CardTitle>
          <CardDescription className="mt-2">{errorInfo.description}</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 space-y-3">
          <Link href="/auth/login">
            <Button className="w-full bg-brand-gradient text-white">Try Again</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">Go Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
