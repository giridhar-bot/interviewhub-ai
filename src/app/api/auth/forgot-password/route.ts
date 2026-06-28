import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitPasswordReset } from "@/lib/rate-limit";
import { generateToken, hashToken, getClientIP } from "@/lib/security";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const ip = await getClientIP();
  const { success } = await rateLimitPasswordReset(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true, email: true, deletedAt: true },
  });

  // Always return success to prevent email enumeration
  if (!user || user.deletedAt) {
    return NextResponse.json({ success: true });
  }

  // Generate reset token (store hashed, send raw)
  const rawToken = generateToken();
  const hashedTokenValue = hashToken(rawToken);
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Store token in VerificationToken table
  await prisma.verificationToken.create({
    data: {
      identifier: `password-reset:${user.email}`,
      token: hashedTokenValue,
      expires,
    },
  });

  // In production, send email via Resend/SendGrid
  // For now, log the reset link
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
  console.log(`[Password Reset] ${user.email}: ${resetUrl}`);

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entityType: "user",
      entityId: user.id,
      newData: { event: "password_reset_requested" },
    },
  });

  return NextResponse.json({ success: true });
}
