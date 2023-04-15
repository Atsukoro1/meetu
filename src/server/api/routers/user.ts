import { followUserResolver, unfollowUserResolver, updateUserResolver } from "../resolvers/user";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { UpdateUserSchema } from "../schema/user";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(({ ctx, input }) => {
      return updateUserResolver(ctx.session, input);
    }),

  folllowUser: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return followUserResolver(ctx, input);
    }),

  unfollowUser: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return unfollowUserResolver(ctx, input);
    })
});
