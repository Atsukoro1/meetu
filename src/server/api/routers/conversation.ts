import { createConversationResolver, createMessageResolver, deleteConversationResolver, fetchMessagesResolver, fetchResolver } from "../resolvers/conversation";
import { CreateConversationSchema, CreateMessageSchema, DeleteConversationSchema, FetchMessagesSchema } from "../schema/conversation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const conversationRouter = createTRPCRouter({
    createConversation: protectedProcedure
        .input(CreateConversationSchema)
        .mutation(({ input }) => {
            return createConversationResolver(input);
        }),

    createMessage: protectedProcedure
        .input(CreateMessageSchema)
        .mutation(({ ctx, input }) => {
            return createMessageResolver(ctx.session, input);
        }),

    deleteConversation: protectedProcedure
        .input(DeleteConversationSchema)
        .mutation(({ ctx, input }) => {
            return deleteConversationResolver(ctx.session, input);
        }),

    fetch: protectedProcedure
        .mutation(({ ctx }) => {
            return fetchResolver(ctx.session);
        }),

    fetchMesssages: protectedProcedure
        .input(FetchMessagesSchema)
        .mutation(({ ctx, input }) => {
            return fetchMessagesResolver(ctx.session, input);
        })
});

export default conversationRouter;