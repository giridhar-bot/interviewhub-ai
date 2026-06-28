import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { token, email, password } = parsed.data;
  const hashedToken = hashToken(token);

  // Find valid token
  const storedToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: `password-reset:${email}`,
      token: hashedToken,
      expires: { gt: new Date() },
    },
  });

  if (!storedToken) {
    return NextResponse.json(
      { error: "Invalid or expired reset link" },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update password
  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
    select: { id: true },
  });

  // Delete used token
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: storedToken.identifier,
        token: storedToken.token,
      },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE",
      entityType: "user",
      entityId: user.id,
      newData: { event: "password_reset_completed" },
    },
  });

  return NextResponse.json({ success: true });
}
