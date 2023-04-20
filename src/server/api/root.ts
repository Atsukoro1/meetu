import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { postRouter } from "./routers/post";
import notificationRouter from "./routers/notification";

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  notification: notificationRouter
});

export type AppRouter = typeof appRouter;
