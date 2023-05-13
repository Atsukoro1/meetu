import { countUnreadNotifications, fetchNotificationsResolver } from "../resolvers/notification";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

const notificationRouter = createTRPCRouter({
    fetchNotifications: protectedProcedure
        .input(z.object({
            page: z.number().default(1),
            perPage: z.number().default(10)
        }))
        .query(({ ctx, input }) => {
            return fetchNotificationsResolver(ctx.session, input);
        }),

    unreadNotificationCount: protectedProcedure
        .query(({ ctx }) => {
            return countUnreadNotifications(ctx.session);
        })
});

export default notificationRouter;