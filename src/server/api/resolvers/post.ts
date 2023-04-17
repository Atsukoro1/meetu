import { Session } from "next-auth";
import { CreatePostSchema, FetchPostsSchema, GetPostsByUserSchema, ToggleInteractionSchema } from "../schema/post";
import { prisma } from "@/server/db";
import { Post } from "@prisma/client";
import { ExtendedPost } from "@/components/Post";

export const createPostResolver = async (
    { user }: Session,
    input: typeof CreatePostSchema._input
): Promise<Post> => {
    return await prisma.post.create({
        data: {
            authorId: user.id,
            content: input.content
        }
    });
}

export const fetchPostsResolver = async (
    { user }: Session,
    input: typeof FetchPostsSchema._input
): Promise<{ posts: Post[]; totalPages: number; hasMore: boolean; hasPrevious: boolean }> => {
    const skip = (input.page as number - 1) * (input.perPage as number);
    const take = input.perPage;

    const [count, posts] = await Promise.all([
        prisma.post.count(),
        prisma.post.findMany({
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                author: true,
                likes: { where: { userId: user.id ?? undefined }, take: 1 },
                dislikes: { where: { userId: user.id ?? undefined }, take: 1 },
            },
        }),
    ]);

    const totalPages = Math.ceil(count / (input.perPage as number));
    const hasMore = input.page as number < totalPages;
    const hasPrevious = input.page as number > 1;

    const postsWithLikesDislikes = posts.map((post) => {
        const userLiked = !!post.likes.length;
        const userDisliked = !!post.dislikes.length;
        return { ...post, userLiked, userDisliked };
    });

    return { posts: postsWithLikesDislikes, totalPages, hasMore, hasPrevious };
};


export const getPostsByUserResolver = async (
    { user }: Session,
    input: typeof GetPostsByUserSchema._input
): Promise<ExtendedPost[]> => {
    const skip = (input.page as number - 1) * (input.perPage as number);
    const take = input.perPage;

    const posts = await prisma.post.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        where: {
            authorId: input.userId
        },
        include: {
            author: true,
            likes: { where: { userId: user.id ?? undefined }, take: 1 },
            dislikes: { where: { userId: user.id ?? undefined }, take: 1 },
        },
    });

    const postsWithLikesDislikes = posts.map((post) => {
        const userLiked = !!post.likes.length;
        const userDisliked = !!post.dislikes.length;
        return { ...post, userLiked, userDisliked };
    });

    return postsWithLikesDislikes;
}

export const toggleInteractionResolver = async (
    { user }: Session,
    input: typeof ToggleInteractionSchema._input
): Promise<Post | null> => {
    const post = await prisma.post.findUnique({ where: { id: input.postId } });

    if (!post || !user) {
        throw new Error(`Can't find`);
    }

    const existingLike = await prisma.postLike.findUnique({
        where: {
            postId_userId: {
                postId: input.postId,
                userId: user.id
            }
        },
    });

    const existingDislike = await prisma.postDislike.findUnique({
        where: {
            postId_userId: {
                postId: post.id,
                userId: user.id
            }
        }
    });

    if (input.type === "LIKE") {
        if (existingDislike) {
            await prisma.postDislike.delete({
                where: {
                    postId_userId: {
                        postId: post.id,
                        userId: user.id
                    }
                }
            });

            await prisma.postLike.upsert({
                where: {
                    postId_userId: {
                        postId: post.id,
                        userId: user.id
                    }
                },
                update: {},
                create: {
                    postId: post.id,
                    userId: user.id
                },
            });
        } else if (!existingLike) {
            await prisma.postLike.create({
                data: {
                    postId: post.id,
                    userId: user.id
                }
            });
        } else {
            await prisma.postLike.delete({
                where: {
                    postId_userId: {
                        postId: post.id,
                        userId: user.id
                    }
                }
            });
        }
    } else if (input.type === "DISLIKE") {
        if (existingLike) {
            await prisma.postLike.delete({
                where: {
                    postId_userId: {
                        postId: post.id,
                        userId: user.id
                    }
                }
            });

            await prisma.postDislike.upsert({
                where: {
                    postId_userId: {
                        postId: post.id,
                        userId: user.id
                    }
                },
                update: {},
                create: {
                    postId: post.id,
                    userId: user.id
                },
            });
        } else if (!existingDislike) {
            await prisma.postDislike.create({
                data: {
                    postId: post.id,
                    userId: user.id
                }
            });
        } else {
            await prisma.postDislike.delete({
                where: {
                    postId_userId: {
                        postId: post.id,
                        userId: user.id
                    }
                }
            });
        }
    }

    return prisma.post.findUnique({
        where: {
            id: post.id
        }
    });
}
