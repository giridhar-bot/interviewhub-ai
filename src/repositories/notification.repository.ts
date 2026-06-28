// ══════════════════════════════════════════════════════════════
// InterviewHub AI — Notification Repository
// ══════════════════════════════════════════════════════════════

import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@/generated/prisma/client";

export const notificationRepository = {
  async findByUserId(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);
    return { notifications, total, page, totalPages: Math.ceil(total / limit) };
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  },

  async unreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  },

  async create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    actorId?: string;
    entityType?: string;
    entityId?: string;
  }) {
    return prisma.notification.create({ data });
  },
};
