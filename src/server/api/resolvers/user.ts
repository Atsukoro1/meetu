import { prisma } from "@/server/db";
import { UpdateUserSchema } from "../schema/user";

export const followUserResolver = async (
    { user }: any,
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
    { user }: any,
    userId: string
): Promise<void> => {
    await prisma.userFollows.deleteMany({
        where: {
          followerId: userId,
          followingId: user.id,
        },
    });
}

export const updateUserResolver = async (
    { user }: any,
    data: typeof UpdateUserSchema._input
): Promise<void> => {
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
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