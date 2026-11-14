"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";
import { rateLimitLogin, rateLimitRegister } from "@/lib/rate-limit";
import { getClientIP } from "@/lib/security";
import { createUser, getUserByEmail } from "@/services/user.service";
import { auditLog } from "@/services/audit.service";
import { logger } from "@/lib/logger";
import { Prisma } from "@/generated/prisma/client";

export type AuthFormState = { error: string };

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const limit = await rateLimitLogin(await getClientIP());
    if (!limit.success) return { error: "Too many login attempts. Try again in a minute." };
    await signIn("credentials", { ...parsed.data, redirect: false });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      return { error: "Email or password is incorrect." };
    }
    logger.error("Login failed", error);
    return { error: "Unable to log in right now. Please try again." };
  }
  redirect("/dashboard");
}

export async function registerAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const limit = await rateLimitRegister(await getClientIP());
    if (!limit.success) return { error: "Too many registrations. Please try again later." };
    if (await getUserByEmail(parsed.data.email)) {
      return { error: "An account with this email already exists. Please log in." };
    }
    const user = await createUser(parsed.data);
    await auditLog.create(user.id, "user", user.id, { event: "registration" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "An account with this email already exists. Please log in." };
    }
    logger.error("Registration failed", error);
    return { error: "Unable to create your account right now. Please try again." };
  }
  redirect("/auth/login?registered=1");
}

export async function oauthAction(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const provider = formData.get("provider");
  if (provider !== "google" && provider !== "github") {
    return { error: "Please choose a supported sign-in provider." };
  }
  try {
    await signIn(provider, { redirectTo: "/dashboard" });
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;
    logger.error("OAuth sign-in failed", error);
    return { error: "This sign-in provider is unavailable. Please use email and password." };
  }
  return { error: "" };
}
