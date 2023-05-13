import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const notificationRouter = createTRPCRouter({
    fetchNotifications: protectedProcedure
        .input(z.object({
            page: z.number().default(1),
            perPage: z.number().default(10)
        }))
        .query(async ({ ctx, input }) => {
            const perPage = input.perPage as number;
            const currentPage = input.page as number;

            const totalNotifications = await prisma.notification.count({
                where: {
                    recipientId: ctx.session.user.id,
                },
            });

            const totalPages = Math.ceil(totalNotifications / perPage);

            const notifications = await prisma.notification.findMany({
                where: {
                    recipientId: ctx.session.user.id,
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
        }),

    unreadNotificationCount: protectedProcedure
        .query(async ({ ctx }) => {
            const unreadNotificationCount = await prisma.notification.count({
                where: {
                    recipientId: ctx.session.user.id,
                    read: false,
                },
            });

            return unreadNotificationCount;
        })
});

export default notificationRouter;