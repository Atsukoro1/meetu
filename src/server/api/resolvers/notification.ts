import { prisma } from "@/server/db";
import { Notification } from "@prisma/client";
import { Session } from "next-auth";

export const fetchNotificationsResolver = async (
  { user }: Session,
  input: any
): Promise<{ notifications: Notification[], hasMorePages: boolean }> => {
  const perPage = input.perPage as number;
  const currentPage = input.page as number;

  const totalNotifications = await prisma.notification.count({
    where: {
      recipientId: user.id,
    },
  });

  const totalPages = Math.ceil(totalNotifications / perPage);

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (currentPage - 1) * perPage,
    take: perPage,
  });

  const unreadNotificationIds = notifications
    .filter((notification) => !notification.read)
    .map((notification) => notification.id);

  if (unreadNotificationIds.length > 0) {
    Promise.allSettled([
      prisma.notification.updateMany({
        where: {
          id: {
            in: unreadNotificationIds,
          },
        },
        data: {
          read: true,
        },
      }),
    ]);
  }

  const hasMorePages = currentPage < totalPages;

  return { notifications, hasMorePages };
};

export const countUnreadNotifications = async (
  { user }: Session
): Promise<number> => {
  const unreadNotificationCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return unreadNotificationCount;
};
