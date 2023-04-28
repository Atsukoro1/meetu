import { prisma } from "@/server/db";
import { Conversation, Message } from "@prisma/client";
import { Session } from "next-auth";
import {
  CreateConversationSchema,
  CreateMessageSchema,
  DeleteConversationSchema,
  FetchMessagesSchema,
} from "../schema/conversation";

export const createConversationResolver = async (
  input: typeof CreateConversationSchema._input
): Promise<Conversation> => {
  const newConversation = await prisma.conversation.create({
    data: {
      title: input.title,
      userIds: input.userIds,
    },
  });

  return newConversation;
};

export const deleteConversationResolver = async (
  { user }: Session,
  input: typeof DeleteConversationSchema._input
): Promise<Conversation> => {
  const deletedConversation = await prisma.conversation.delete({
    where: {
      id: input.conversationId,
    },
  });

  return deletedConversation;
};

export const fetchResolver = async ({
  user,
}: Session): Promise<Conversation[]> => {
  const conversations = await prisma.conversation.findMany({
    where: {
      userIds: {
        has: user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return conversations;
};

export const createMessageResolver = async (
    { user }: Session,
    input: typeof CreateMessageSchema._input
): Promise<Message> => {
    const newMessage = await prisma.message.create({
        data: {
            content: input.content,
            authorId: user.id,
            conversationId: input.conversationId,
            imageUrl: input.imageUrl, 
        },
    });
    
    return newMessage;
};

export const fetchMessagesResolver = async (
    { user }: Session,
    input: typeof FetchMessagesSchema._input
): Promise<Message[]> => {
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

  return messages;
}