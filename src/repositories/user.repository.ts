// ══════════════════════════════════════════════════════════════
// InterviewHub AI — User Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import type { RoleType } from "@/generated/prisma/client";

export const userRepository = {
  async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data: { ...data, displayName: data.name },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        image: true,
        role: true,
        plan: true,
      },
    });
  },

  async getSettings(id: string) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        name: true,
        displayName: true,
        email: true,
        bio: true,
        timezone: true,
        locale: true,
      },
    });
  },

  async updateSettings(id: string, data: { displayName: string; bio: string; timezone: string }) {
    return prisma.user.update({
      where: { id, deletedAt: null },
      data: { ...data, name: data.displayName },
      select: { id: true, displayName: true },
    });
  },

  async getProfileById(id: string) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        name: true,
        displayName: true,
        username: true,
        bio: true,
        image: true,
        avatar: true,
        role: true,
        plan: true,
        createdAt: true,
        xp: true,
        streak: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  async findMany(page = 1, limit = 20, filters?: { role?: RoleType; search?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.search) {
      where.OR = [
        { displayName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { username: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          email: true,
          displayName: true,
          username: true,
          avatar: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  },

  async updateRole(id: string, role: RoleType) {
    return prisma.user.update({ where: { id }, data: { role } });
  },
};
