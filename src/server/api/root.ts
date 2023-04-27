import notificationRouter from "./routers/notification";
import conversationRouter from "./routers/conversation";
import { createTRPCRouter } from "@/server/api/trpc";
import userRouter from "./routers/user";
import postRouter from "./routers/post";

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  notification: notificationRouter,
  conversation: conversationRouter
});

export type AppRouter = typeof appRouter;
