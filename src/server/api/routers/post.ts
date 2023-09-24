import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@/server/db";
import { NotificationType, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

const postRouter = createTRPCRouter({
  listMetarankInteractions: protectedProcedure.query(async ({ ctx }) => {
    const posts = await prisma.post.findMany();

    const likes = (await prisma.postLike.findMany()).map(item => {
      return { ...item, type: 'like' };
    });

    const dislikes = (await prisma.postDislike.findMany()).map(item => {
      return { ...item, type: 'dislike' };
    });

    const items = likes.concat(dislikes).map((interaction, index) => {
      return {
        event: 'interaction',
        id: randomUUID(),
        timestamp: interaction.createdAt.getTime().toString(),
        user: interaction.userId,
        item: interaction.postId,
        type: interaction.type,
        fields: []
      }
    });

    // Make n count groups of items that will have 3 items each and make them in this format: "    {  "event": "ranking",  "id": "random id",  "timestamp": "1599391467000",  "user": "userid",  "items": [    {"id": "item1"},    {"id": "item2"},    {"id": "item3"}   ]}"
    const n = 3;
    const groups = items.map((item, index) => {
      return index % n === 0 ? items.slice(index, index + n) : null;
    }).filter(item => item !== null);

    const rankings = groups.map((group, index) => {
      return {
        event: 'ranking',
        id: randomUUID(),
        timestamp: group[0].timestamp,
        user: group[0].user,
        items: group.map(item => {
          return { id: item.item };
        }).filter(item => {
          return posts.some(post => post.id === item.id);
        })
      }
    });

    rankings.forEach(ranking => {
      console.log(JSON.stringify(ranking));
      items.filter(item => item.timestamp === ranking.timestamp).forEach(item => {
        console.log(JSON.stringify({
          ...item, 
          ranking: ranking.id
        }));
      });
    });

    return null;
  }),

  listMetarankPosts: protectedProcedure.query(async ({ ctx }) => {
    const posts = await prisma.post.findMany();
    const likes = await prisma.postLike.findMany();
    const dislikes = await prisma.postDislike.findMany();

    const postsWithLikesDislikes = posts.map((post, index) => {
      const likeCount = likes.filter((like) => like.postId === post.id).length;
      const dislikeCount = dislikes.filter(
        (dislike) => dislike.postId === post.id
      ).length;

      return {
        event: "item",
        fields: [
          {
            name: "content",
            value: post.content,
          },
          {
            name: "tags",
            value: post.tags,
          },
          {
            name: "mentions",
            value: post.mentions,
          },
          {
            name: "like_cnt",
            value: likeCount,
          },
          {
            name: "dislike_cnt",
            value: dislikeCount,
          },
        ],
        item: post.id,
        id: randomUUID(),
        timestamp: post.createdAt.getTime().toString(),
      };
    });

    postsWithLikesDislikes.forEach((el) => {
      console.log(JSON.stringify(el));
    });

    return null;
  }),

  createPost: protectedProcedure
    .input(
      z.object({
        attachmentId: z.string().optional(),
        content: z.string().max(2048).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tags = input.content?.match(/#[a-zA-Z0-9]+/g) || [];
      const mentions = input.content?.match(/@[a-zA-Z0-9]+/g) || [];

      const createdPost = await prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
          ...(input.attachmentId && {
            attachmentId: input.attachmentId,
          }),
          tags,
          mentions,
        },
        include: {
          author: true,
          attachment: true,
          likes: { where: { userId: ctx.session.user.id ?? undefined } },
          dislikes: { where: { userId: ctx.session.user.id ?? undefined } },
        },
      });

      const [likeCount, dislikeCount] = [0, 0];

      const userLiked = createdPost.likes.some(
        (like) => like.userId === ctx.session.user.id
      );
      const userDisliked = createdPost.dislikes.some(
        (dislike) => dislike.userId === ctx.session.user.id
      );

      return {
        ...createdPost,
        userLiked,
        userDisliked,
        likeCount,
        dislikeCount,
      };
    }),

  toggleInteraction: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        type: z.enum(["LIKE", "DISLIKE"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const post = await prisma.post.findUnique({
        where: { id: input.postId },
      });

      if (!post || !user) {
        throw new Error(`Can't find`);
      }

      const existingLike = await prisma.postLike.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: user.id,
          },
        },
      });

      const existingDislike = await prisma.postDislike.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: user.id,
          },
        },
      });

      if (input.type === "LIKE") {
        if (existingDislike) {
          await prisma.postDislike.delete({
            where: {
              postId_userId: {
                postId: post.id,
                userId: user.id,
              },
            },
          });

          await prisma.postLike.upsert({
            where: {
              postId_userId: {
                postId: post.id,
                userId: user.id,
              },
            },
            update: {},
            create: {
              postId: post.id,
              userId: user.id,
            },
          });
        } else if (!existingLike) {
          prisma.notification.create({
            data: {
              type: NotificationType.LIKE,
              title: "New like",
              content: `User ${user.id} just liked your post!`,
              image: user.image,
              recipientId: post.authorId,
            },
          });

          await prisma.postLike.create({
            data: {
              postId: post.id,
              userId: user.id,
            },
          });
        } else {
          await prisma.postLike.delete({
            where: {
              postId_userId: {
                postId: post.id,
                userId: user.id,
              },
            },
          });
        }
      } else if (input.type === "DISLIKE") {
        if (existingLike) {
          await prisma.postLike.delete({
            where: {
              postId_userId: {
                postId: post.id,
                userId: user.id,
              },
            },
          });

          await prisma.postDislike.upsert({
            where: {
              postId_userId: {
                postId: post.id,
                userId: user.id,
              },
            },
            update: {},
            create: {
              postId: post.id,
              userId: user.id,
            },
          });
        } else if (!existingDislike) {
          await prisma.postDislike.create({
            data: {
              postId: post.id,
              userId: user.id,
            },
          });
        } else {
          await prisma.postDislike.delete({
            where: {
              postId_userId: {
                postId: post.id,
                userId: user.id,
              },
            },
          });
        }
      }

      return prisma.post.findUnique({
        where: {
          id: post.id,
        },
      });
    }),

  fetchPosts: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = ((input.page as number) - 1) * (input.perPage as number);
      const user = ctx.session.user;
      const take = input.perPage;

      const [count, posts] = await Promise.all([
        prisma.post.count(),
        prisma.post.findMany({
          skip,
          take,
          orderBy: { createdAt: "desc" },
          include: {
            author: true,
            attachment: true,
            likes: { where: { userId: user.id ?? undefined } },
            dislikes: { where: { userId: user.id ?? undefined } },
          },
        }),
      ]);

      const postIds = posts.map((post) => post.id);

      const [likesCount, dislikesCount] = await Promise.all([
        prisma.postLike.groupBy({
          by: ["postId"],
          _count: { postId: true },
          where: { postId: { in: postIds } },
        }),
        prisma.postDislike.groupBy({
          by: ["postId"],
          _count: { postId: true },
          where: { postId: { in: postIds } },
        }),
      ]);

      const likeCountsMap = Object.fromEntries(
        likesCount.map(({ postId, _count }) => [postId, _count.postId])
      );
      const dislikeCountsMap = Object.fromEntries(
        dislikesCount.map(({ postId, _count }) => [postId, _count.postId])
      );

      const postsWithLikesDislikes = posts.map((post) => {
        const likeCount = likeCountsMap[post.id] || 0;
        const dislikeCount = dislikeCountsMap[post.id] || 0;
        const userLiked = post.likes.some((like) => like.userId === user.id);
        const userDisliked = post.dislikes.some(
          (dislike) => dislike.userId === user.id
        );

        return { ...post, userLiked, userDisliked, likeCount, dislikeCount };
      });

      const totalPages = Math.ceil(count / (input.perPage as number));
      const hasMore = (input.page as number) < totalPages;
      const hasPrevious = (input.page as number) > 1;

      return {
        posts: postsWithLikesDislikes,
        totalPages,
        hasMore,
        hasPrevious,
      };
    }),

  getPostsByUser: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().default(10),
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = ((input.page as number) - 1) * (input.perPage as number);
      const user = ctx.session.user;
      const take = input.perPage;

      const posts = await prisma.post.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        where: {
          authorId: input.userId,
        },
        include: {
          attachment: true,
          author: true,
          likes: { where: { userId: user.id ?? undefined } },
          dislikes: { where: { userId: user.id ?? undefined } },
        },
      });

      const postIds = posts.map((post) => post.id);

      const [likesCount, dislikesCount] = await Promise.all([
        prisma.postLike.groupBy({
          by: ["postId"],
          _count: { postId: true },
          where: { postId: { in: postIds } },
        }),
        prisma.postDislike.groupBy({
          by: ["postId"],
          _count: { postId: true },
          where: { postId: { in: postIds } },
        }),
      ]);

      const likeCountsMap = Object.fromEntries(
        likesCount.map(({ postId, _count }) => [postId, _count.postId])
      );
      const dislikeCountsMap = Object.fromEntries(
        dislikesCount.map(({ postId, _count }) => [postId, _count.postId])
      );

      const postsWithLikesDislikes = posts.map((post) => {
        const likeCount = likeCountsMap[post.id] || 0;
        const dislikeCount = dislikeCountsMap[post.id] || 0;
        const userLiked = post.likes.some((like) => like.userId === user.id);
        const userDisliked = post.dislikes.some(
          (dislike) => dislike.userId === user.id
        );

        return { ...post, userLiked, userDisliked, likeCount, dislikeCount };
      });

      return postsWithLikesDislikes;
    }),

  createPostComment: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const { content, postId } = input;

      const newComment = await prisma.comment.create({
        data: {
          content,
          author: {
            connect: { id: user.id },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        } as Prisma.CommentCreateInput,
      });

      const post = await prisma.post.findFirst({ where: { id: postId } });

      prisma.notification.create({
        data: {
          type: NotificationType.COMMENT,
          title: "New comment on your post",
          content: `User ${
            user.name
          } just commented: "${input.content.substring(0, 20)}"`,
          recipientId: post?.authorId || "",
          image: user.image,
        },
      });

      return newComment;
    }),

  deletePostComment: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletedComment = await prisma.comment.delete({
        where: { id: input.commentId },
      });

      return deletedComment;
    }),

  fetchPostComments: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        page: z.number(),
        perPage: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const skip = input.perPage * (input.page - 1);
      const [comments, commentsCount] = await Promise.all([
        prisma.comment.findMany({
          where: {
            postId: input.postId,
          },
          include: {
            author: true,
            post: true,
          },
          skip,
          take: input.perPage,
          orderBy: { createdAt: "desc" },
        }),
        prisma.comment.count({
          where: {
            postId: input.postId,
          },
        }),
      ]);

      return {
        comments,
        commentsCount,
      };
    }),

  createPostAttachment: protectedProcedure
    .input(
      z.object({
        type: z.string(),
      })
    )
    .mutation(({ input }) => {
      return prisma.attachment.create({
        data: {
          type: input.type,
        },
      });
    }),
});

export default postRouter;
