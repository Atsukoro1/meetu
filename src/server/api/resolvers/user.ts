import PusherClient from "@/utils/pusher";
import { prisma } from "@/server/db";
import slugify from "@/utils/slugify";
import { NotificationType, User } from "@prisma/client";
import { Session } from "next-auth";

export const meResolver = async ({ user }: Session): Promise<User> => {
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
};

export const newUsersResolver = async (): Promise<User[]> => {
    const recentUsers = await prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
    });

    return recentUsers;
}

export const searchUsersResolver = async (nameOrSlug: string | null): Promise<User[]> => {
    if(!nameOrSlug) return [];
    
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: nameOrSlug,
              mode: 'insensitive', // This makes the search case-insensitive
            },
          },
          {
            slug: {
              contains: nameOrSlug,
              mode: 'insensitive', // This makes the search case-insensitive
            },
          },
        ],
      },
      take: 5,
    });

    return users;
  }

export const unfollowUserResolver = async (
    { user }: Session,
    userId: string
): Promise<void> => {
    await prisma.userFollows.deleteMany({
        where: {
            followerId: userId,
            followingId: user.id,
        },
    });
}

export const fetchFollowingResolver = async (
    input: any
): Promise<any> => {
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
}