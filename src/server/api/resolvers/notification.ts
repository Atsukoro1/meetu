import { prisma } from "@/server/db";
import { Notification } from "@prisma/client";
import { Session } from "next-auth";
import { FetchNotificationsSchema } from "../schema/notification";

export const fetchNotificationsResolver = async (
  { user }: Session,
  input: typeof FetchNotificationsSchema._input
): Promise<Notification[]> => {
  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: ((input.page as number) - 1) * (input.perPage as number),
    take: input.perPage as number,
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

  return notifications;
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
