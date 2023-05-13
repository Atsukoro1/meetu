import { createConversationResolver, createMessageResolver, deleteConversationResolver, fetchMessagesResolver, fetchResolver } from "../resolvers/conversation";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from 'zod';

const conversationRouter = createTRPCRouter({
    createConversation: protectedProcedure
        .input(z.object({
            title: z.string(),
            userIds: z.array(z.string())
        }))
        .mutation(({ input }) => {
            return createConversationResolver(input);
        }),

    createMessage: protectedProcedure
        .input(z.object({
            content: z.string(),
            conversationId: z.string(),
            imageUrl: z.string().nullable()
        }))
        .mutation(({ ctx, input }) => {
            return createMessageResolver(ctx.session, input);
        }),

    deleteConversation: protectedProcedure
        .input(z.object({
            conversationId: z.string()
        }))
        .mutation(({ ctx, input }) => {
            return deleteConversationResolver(ctx.session, input);
        }),

    fetch: protectedProcedure
        .query(({ ctx }) => {
            return fetchResolver(ctx.session);
        }),

    fetchMesssages: protectedProcedure
        .input(z.object({
            conversationId: z.string(),
            page: z.number().default(1),
            perPage: z.number().default(10)
        }))
        .query(({ ctx, input }) => {
            return fetchMessagesResolver(ctx.session, input);
        })
});

export default conversationRouter;