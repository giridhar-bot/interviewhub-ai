import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Email",
};

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-5xl mb-4">📧</div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription className="mt-2">
            A magic link has been sent to your email address.
            Click the link in the email to sign in — no password needed!
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 space-y-3">
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">Back to Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
