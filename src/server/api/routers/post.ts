import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createPostAttachmentResolver, createPostCommentResolver, createPostResolver, deletePostCommentResolver, fetchPostsResolver, getPostComments, getPostsByUserResolver, toggleInteractionResolver } from "../resolvers/post";
import { z } from "zod";

const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(z.object({
            attachmentId: z.string().optional(),
            content: z.string().max(2048).optional()
        }))
        .mutation(({ ctx, input }) => {
            return createPostResolver(ctx.session, input);
        }),

    toggleInteraction: protectedProcedure
        .input(z.object({
            postId: z.string(),
            type: z.enum(['LIKE', 'DISLIKE'])
        }))
        .mutation(({ ctx, input }) => {
            return toggleInteractionResolver(ctx.session, input);
        }),

    fetchPosts: protectedProcedure
        .input(z.object({
            page: z.number().min(1).default(1),
            perPage: z.number().default(10)
        }))
        .query(({ ctx, input }) => {
            return fetchPostsResolver(ctx.session, input);
        }),

    getPostsByUser: protectedProcedure
        .input(z.object({
            page: z.number().min(1).default(1),
            perPage: z.number().default(10),
            userId: z.string()
        }))
        .query(({ ctx, input }) => {
            return getPostsByUserResolver(ctx.session, input);
        }),

    createPostComment: protectedProcedure
        .input(z.object({
            content: z.string(),
            postId: z.string()
        }))
        .mutation(({ ctx, input }) => {
            return createPostCommentResolver(ctx.session, input);
        }),

    deletePostComment: protectedProcedure
        .input(z.object({
            commentId: z.string()
        }))
        .mutation(({ ctx, input }) => {
            return deletePostCommentResolver(ctx.session, input);
        }),

    fetchPostComments: protectedProcedure
        .input(z.object({
            postId: z.string(),
            page: z.number(),
            perPage: z.number()
        }))
        .query(({ ctx, input }) => {
            return getPostComments(ctx.session, input);
        }),
    
    createPostAttachment: protectedProcedure
        .input(z.object({
            type: z.string()
        }))
        .mutation(({ input }) => {
            return createPostAttachmentResolver(input);
        })
});

export default postRouter;