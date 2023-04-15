import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
    createPost: protectedProcedure
        .mutation(({ ctx }) => {
        }),

    likePost: protectedProcedure
        .mutation(({ ctx }) => {

        }),

    dislikePost: protectedProcedure
        .mutation(({ ctx }) => {
            
        })
});