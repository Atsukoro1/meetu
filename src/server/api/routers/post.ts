import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createPostCommentResolver, createPostResolver, deletePostCommentResolver, fetchPostsResolver, getPostComments, getPostsByUserResolver, toggleInteractionResolver } from "../resolvers/post";
import { CreatePostCommentSchema, CreatePostSchema, DeletePostCommentSchema, FetchPostsSchema, GetPostCommentsSchema, GetPostsByUserSchema, ToggleInteractionSchema } from "../schema/post";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .input(CreatePostSchema)
        .mutation(({ ctx, input }) => {
            return createPostResolver(ctx.session, input);
        }),

    toggleInteraction: protectedProcedure
        .input(ToggleInteractionSchema)
        .mutation(({ ctx, input }) => {
            return toggleInteractionResolver(ctx.session, input);
        }),

    fetchPosts: protectedProcedure
        .input(FetchPostsSchema)
        .query(({ ctx, input }) => {
            return fetchPostsResolver(ctx.session, input);
        }),

    getPostsByUser: protectedProcedure
        .input(GetPostsByUserSchema)
        .query(({ ctx, input }) => {
            return getPostsByUserResolver(ctx.session, input);
        }),

    createPostComment: protectedProcedure
        .input(CreatePostCommentSchema)
        .mutation(({ ctx, input }) => {
            return createPostCommentResolver(ctx.session, input);
        }),

    deletePostComment: protectedProcedure
        .input(DeletePostCommentSchema)
        .mutation(({ ctx, input }) => {
            return deletePostCommentResolver(ctx.session, input);
        }),

    fetchPostComments: protectedProcedure
        .input(GetPostCommentsSchema)
        .query(({ ctx, input }) => {
            return getPostComments(ctx.session, input);
        })
});