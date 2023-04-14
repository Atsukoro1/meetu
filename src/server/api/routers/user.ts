import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { UpdateUserSchema } from "../schema/user";
import { updateUserResolver } from "../resolvers/user";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(UpdateUserSchema)
    .mutation(({ ctx, input }) => {
      return updateUserResolver(ctx.session, input);
    })
});
