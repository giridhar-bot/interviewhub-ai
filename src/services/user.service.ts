import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { RegisterInput } from "@/lib/validations";
import { userRepository } from "@/repositories/user.repository";

export async function createUser(input: RegisterInput) {
  const hashedPassword = await bcrypt.hash(input.password, 12);

  return userRepository.create({ name: input.name, email: input.email, password: hashedPassword });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      plan: true,
      xp: true,
      streak: true,
      createdAt: true,
    },
  });
}

export async function getUserByEmail(email: string) {
  return userRepository.findByEmail(email);
}

export async function updateUserStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveAt: true, streak: true },
  });

  if (!user) return;

  const now = new Date();
  const lastActive = user.lastActiveAt;
  let newStreak = user.streak;

  if (lastActive) {
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
    if (diffHours >= 24 && diffHours < 48) {
      newStreak += 1;
    } else if (diffHours >= 48) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { streak: newStreak, lastActiveAt: now },
  });
}
