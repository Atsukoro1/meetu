import { fetchFollowingResolver, followUserResolver, meResolver, newUsersResolver, searchUsersResolver, unfollowUserResolver, updateUserResolver } from "../resolvers/user";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { FetchFollowingSchema, UpdateUserSchema } from "../schema/user";
import { z } from "zod";

const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(({ ctx, input }) => {
      return updateUserResolver(ctx.session, input);
    }),

  folllowUser: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return followUserResolver(ctx.session, input); 
    }),

  unfollowUser: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return unfollowUserResolver(ctx.session, input);
    }),

  searchUsers: publicProcedure
    .input(z.string().nullable())
    .query(({ input }) => {
      return searchUsersResolver(input);
    }),

  getFollowing: publicProcedure
    .input(FetchFollowingSchema)
    .query(({ input }) => {
      return fetchFollowingResolver(input);
    }),

  me: protectedProcedure
    .query(({ ctx }) => {
      return meResolver(ctx.session);
    }),

  newUsers: protectedProcedure
    .query(() => {
      return newUsersResolver();
    })
});

export default userRouter;