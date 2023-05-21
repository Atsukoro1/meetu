import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from 'zod';
import PusherClient from "@/utils/pusher";
import { NotificationType } from "@prisma/client";

const conversationRouter = createTRPCRouter({
    createConversation: protectedProcedure
        .input(z.object({
            title: z.string(),
            userIds: z.array(z.string())
        }))
        .mutation(async ({ input }) => {
            const newConversation = await prisma.conversation.create({
                data: {
                    title: input.title,
                    userIds: input.userIds,
                },
            });

            return newConversation;
        }),

    createMessage: protectedProcedure
        .input(z.object({
            content: z.string(),
            conversationId: z.string(),
            imageUrl: z.string().nullable()
        }))
        .mutation(async ({ ctx, input }) => {
            const newMessage = await prisma.message.create({
                data: {
                    content: input.content,
                    authorId: ctx.session.user.id,
                    conversationId: input.conversationId,
                    imageUrl: input.imageUrl,
                },
                include: {
                    author: true,
                    conversation: true
                }
            });

            PusherClient.trigger(
                newMessage.conversation.userIds.find(el => el !== ctx.session.user.id) || "",
                NotificationType.MESSAGE,
                newMessage
            );

            return newMessage;
        }),

    deleteConversation: protectedProcedure
        .input(z.object({
            conversationId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const deletedConversation = await prisma.conversation.delete({
                where: {
                    id: input.conversationId,
                },
            });

            return deletedConversation;
        }),

    fetch: protectedProcedure
        .query(async ({ ctx }) => {
            const conversations = await prisma.conversation.findMany({
                where: {
                    userIds: {
                        has: ctx.session.user.id,
                    },
                },
                include: {
                    users: true
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return conversations;
        }),

    fetchMesssages: protectedProcedure
        .input(z.object({
            conversationId: z.string(),
            page: z.number().default(1),
            perPage: z.number().default(10)
        }))
        .query(async ({ ctx, input }) => {
            const skip = (input.page as number - 1) * (input.perPage as number);

            const messages = await prisma.message.findMany({
                where: {
                    conversationId: input.conversationId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    author: true
                },
                take: input.perPage,
                skip,
            });

            const unseenMessageIds = messages
                .filter(message => !message.seen && message.authorId !== ctx.session.user.id)
                .map(message => message.id);

            if (unseenMessageIds.length > 0) {
                await prisma.message.updateMany({
                    where: {
                        id: {
                            in: unseenMessageIds,
                        },
                    },
                    data: {
                        seen: true,
                    },
                });
            }

            const updatedMessages = messages.map(message => ({
                ...message,
                seen: message.authorId === ctx.session.user.id ? message.seen : true,
            }));

            const totalCount = await prisma.message.count({
                where: {
                    conversationId: input.conversationId,
                },
            });

            const hasMore = skip + (input.perPage as number) < totalCount;

            // Added hasNextPage field
            return { messages: updatedMessages, hasMore, hasNextPage: hasMore };
        })
});

export default conversationRouter;