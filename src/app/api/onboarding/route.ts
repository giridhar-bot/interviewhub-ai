import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, underscores, and hyphens allowed"),
  displayName: z.string().min(2).max(100),
  experience: z.string().min(1),
  careerGoal: z.string().min(1),
  techStack: z.array(z.string()).min(1),
  targetCompanies: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = onboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  // Check username uniqueness
  const existingUser = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });

  if (existingUser && existingUser.id !== session.user.id) {
    return NextResponse.json(
      { error: "Username is already taken" },
      { status: 409 }
    );
  }

  // Update user profile
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      username: parsed.data.username,
      displayName: parsed.data.displayName,
      bio: `${parsed.data.experience} | ${parsed.data.careerGoal}`,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "UPDATE",
      entityType: "user",
      entityId: session.user.id,
      newData: {
        event: "profile_completed",
        experience: parsed.data.experience,
        careerGoal: parsed.data.careerGoal,
        techStack: parsed.data.techStack,
      },
    },
  });

  return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });
}
