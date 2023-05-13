import { fetchFollowingResolver, followUserResolver, meResolver, newUsersResolver, searchUsersResolver, unfollowUserResolver, updateUserResolver } from "../resolvers/user";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { Gender, SocialType } from "@prisma/client";

const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(z.object({
      setupDone: z.boolean().optional(),
      gender: z.enum([Gender.FEMALE, Gender.MALE]).optional(),
      hobbies: z.array(z.string()).optional(),
      age: z.number().optional(),
      image: z.string().optional(),
      banner: z.string().optional(),
      bio: z.string().optional(),
      socials: z
        .array(
          z.object({
            type: z.enum([
              SocialType.DISCORD,
              SocialType.EMAIL,
              SocialType.GITHUB,
              SocialType.URL,
            ]),
            text: z.string(),
            url: z.string(),
          })
        )
        .optional(),
    }))
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
    .input(z.object({
      page: z.number().default(1),
      perPage: z.number().default(10),
      userId: z.string()
    }))
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