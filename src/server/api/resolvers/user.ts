import { FetchFollowingSchema, UpdateUserSchema } from "../schema/user";
import { prisma } from "@/server/db";
import slugify from "@/utils/slugify";
import { User } from "@prisma/client";
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

export const followUserResolver = async (
    { user }: Session,
    userId: string
): Promise<void> => {
    const existingRelation = await prisma.userFollows.findUnique({
        where: {
            followerId_followingId: {
                followerId: userId,
                followingId: user.id,
            },
        },
    });
    if (existingRelation) return;

    await prisma.userFollows.create({
        data: {
            followerId: userId,
            followingId: user.id,
        },
    });
};

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
    input: typeof FetchFollowingSchema._input
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

export const updateUserResolver = async (
    { user }: Session,
    data: typeof UpdateUserSchema._input
): Promise<void> => {
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            slug: slugify(user.name || ""),
            ...data.gender && { gender: data.gender },
            ...data.age && { age: data.age },
            ...data.bio && { bio: data.bio },
            ...data.hobbies && { hobbies: data.hobbies },
            ...data.image && { image: data.image },
            ...data.banner && { banner: data.banner },
            ...data.setupDone && { setupDone: data.setupDone },
            ...data.socials && {
                socials: {
                    createMany: {
                        data: data.socials.map(el => {
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
}