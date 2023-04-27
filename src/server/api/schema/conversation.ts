import { z } from "zod";

export const CreateConversationSchema = z.object({
    title: z.string(),
    userIds: z.array(z.string())
});

export const DeleteConversationSchema = z.object({
    conversationId: z.string()
});

export const CreateMessageSchema = z.object({
    content: z.string(),
    conversationId: z.string(),
    imageUrl: z.string().nullable()
});

export const FetchMessagesSchema = z.object({
    conversationId: z.string(),
    page: z.number().default(1),
    perPage: z.number().default(10)
});