import { countUnreadNotifications, fetchNotificationsResolver } from "../resolvers/notification";
import { FetchNotificationsSchema } from "../schema/notification";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const notificationRouter = createTRPCRouter({
    fetchNotifications: protectedProcedure
        .input(FetchNotificationsSchema)
        .query(({ ctx, input }) => {
            return fetchNotificationsResolver(ctx.session, input);
        }),

    unreadNotificationCount: protectedProcedure
        .query(({ ctx }) => {
            return countUnreadNotifications(ctx.session);
        })
});

export default notificationRouter;