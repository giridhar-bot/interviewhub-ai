"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { loginAction, registerAction, oauthAction } from "./actions";

export function AuthForm({
  mode,
  providers,
  registered = false,
}: {
  mode: "login" | "register";
  providers: Array<"google" | "github">;
  registered?: boolean;
}) {
  const isRegister = mode === "register";
  const [state, action, pending] = useActionState(isRegister ? registerAction : loginAction, {
    error: "",
  });
  const [oauthState, oauth, oauthPending] = useActionState(oauthAction, { error: "" });

  return (
    <div className="space-y-5 px-6 pb-4">
      {registered && (
        <p role="status" className="rounded-lg bg-success/10 p-3 text-sm text-success">
          Account created. Log in to continue.
        </p>
      )}
      {providers.length > 0 && (
        <>
          <form action={oauth} className="space-y-3">
            {providers.map((provider) => (
              <Button
                key={provider}
                type="submit"
                name="provider"
                value={provider}
                variant="outline"
                className="h-11 w-full"
                disabled={oauthPending || pending}
              >
                Continue with {provider === "google" ? "Google" : "GitHub"}
              </Button>
            ))}
            {oauthState.error && (
              <p role="alert" className="text-sm text-destructive">
                {oauthState.error}
              </p>
            )}
          </form>
          <div className="relative py-2">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or use email
            </span>
          </div>
        </>
      )}
      <form action={action} className="space-y-4">
        {isRegister && (
          <div className="space-y-1.5">
            <label htmlFor="auth-name" className="text-sm font-medium">
              Full name
            </label>
            <Input
              id="auth-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              className="h-11"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label htmlFor="auth-email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="auth-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-11"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="auth-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="auth-password"
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            minLength={8}
            aria-describedby={isRegister ? "password-help" : undefined}
            className="h-11"
          />
          {isRegister && (
            <p id="password-help" className="text-xs text-muted-foreground">
              At least 8 characters, one uppercase letter and one number.
            </p>
          )}
        </div>
        {!isRegister && (
          <Link
            href="/auth/forgot-password"
            className="block text-right text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        )}
        {state.error && (
          <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {state.error}
          </p>
        )}
        <Button type="submit" className="h-11 w-full" disabled={pending || oauthPending}>
          {pending
            ? isRegister
              ? "Creating account..."
              : "Logging in..."
            : isRegister
              ? "Create Account"
              : "Log in"}
        </Button>
      </form>
      {isRegister && (
        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      )}
      <p className="text-center text-sm text-muted-foreground">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <Link
          href={isRegister ? "/auth/login" : "/auth/register"}
          className="font-medium text-primary hover:underline"
        >
          {isRegister ? "Log in" : "Sign up free"}
        </Link>
      </p>
    </div>
  );
}
