import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createPostResolver, fetchPostsResolver, getPostsByUserResolver, toggleInteractionResolver } from "../resolvers/post";
import { CreatePostSchema, FetchPostsSchema, GetPostsByUserSchema, ToggleInteractionSchema } from "../schema/post";

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
        })
});