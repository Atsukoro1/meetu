import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { Gender, NotificationType, SocialType } from "@prisma/client";
import { prisma } from "@/server/db";
import slugify from "@/utils/slugify";
import PusherClient from "@/utils/pusher";

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
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          slug: slugify(user.name || ""),
          ...input.gender && { gender: input.gender },
          ...input.age && { age: input.age },
          ...input.bio && { bio: input.bio },
          ...input.hobbies && { hobbies: input.hobbies },
          ...input.image && { image: input.image },
          ...input.banner && { banner: input.banner },
          ...input.setupDone && { setupDone: input.setupDone },
          ...input.socials && {
            socials: {
              createMany: {
                data: input.socials.map((el: any) => {
                  return {
                    type: el.type,
                    text: el.text,
                    url: el.url
                  }
                })
              }
            }
          }
        }
      });
    }),

  folllowUser: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const existingRelation = await prisma.userFollows.findUnique({
        where: {
          followerId_followingId: {
            followerId: input,
            followingId: user.id,
          },
        },
      });
      if (existingRelation) return;

      await prisma.userFollows.create({
        data: {
          followerId: input,
          followingId: user.id,
        },
      });

      PusherClient.trigger(
        input,
        NotificationType.FOLLOW,
        user
      );

      await prisma.notification.create({
        data: {
          type: NotificationType.FOLLOW,
          title: "New follow",
          content: `User ${user.name} just followed you!`,
          image: user.image,
          recipientId: input
        }
      });
    }),

  unfollowUser: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await prisma.userFollows.deleteMany({
        where: {
            followerId: input,
            followingId: ctx.session.user.id,
        },
    });
    }),

  searchUsers: publicProcedure
    .input(z.string().nullable())
    .query(async ({ input }) => {
      if(!input) return [];
    
      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: input,
                mode: 'insensitive', 
              },
            },
            {
              slug: {
                contains: input,
                mode: 'insensitive', 
              },
            },
          ],
        },
        take: 5,
      });
  
      return users;
    }),

  getFollowing: publicProcedure
    .input(z.object({
      page: z.number().default(1),
      perPage: z.number().default(10),
      userId: z.string()
    }))
    .query(async ({ input }) => {
      const skip = (input.page as number - 1) * (input.perPage as number);

      const followings = await prisma.user.findUnique({
          where: { id: input.userId },
          select: {
              following: {
                  skip: skip,
                  take: input.perPage,
                  select: {
                      following: true,
                  },
              },
          },
      });
  
      return followings;
    }),

  getMyself: protectedProcedure
    .query(async ({ ctx }) => {
      return await prisma.user.findFirst({
        where: {
          id: ctx.session.user.id
        }
      });
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      const user = ctx.session.user;

      const userWithCounts = await prisma.user.findFirst({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            emailVerified: true,
            gender: true,
            setupDone: true,
            hobbies: true,
            age: true,
            image: true,
            bio: true,
            socials: true,
            accounts: true,
            sessions: true,
            authoredPosts: { select: { id: true } },
            following: { select: { followingId: true } },
            followers: { select: { followerId: true } },
        },
    }) as any;

    userWithCounts.postCount = userWithCounts.authoredPosts.length;
    userWithCounts.followerCount = userWithCounts.followers.length;
    userWithCounts.followingCount = userWithCounts.following.length;

    const { following, followers, ...userWithoutSensitiveData } = userWithCounts;

    return userWithoutSensitiveData;
    }),

  newUsers: protectedProcedure
    .query(async () => {
      const recentUsers = await prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
    });

    return recentUsers;
    })
});

export default userRouter;