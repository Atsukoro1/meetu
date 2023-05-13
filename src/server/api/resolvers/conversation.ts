import { prisma } from "@/server/db";
import { Conversation, Message, NotificationType, User } from "@prisma/client";
import { Session } from "next-auth";
import PusherClient from "@/utils/pusher";

export const createConversationResolver = async (
  input: any
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
  input: any
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
}: Session): Promise<(Conversation & { users: User[] })[]> => {
  const conversations = await prisma.conversation.findMany({
    where: {
      userIds: {
        has: user.id,
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
};

export const createMessageResolver = async (
  { user }: Session,
  input: any
): Promise<Message & { author: User }> => {
  const newMessage = await prisma.message.create({
    data: {
      content: input.content,
      authorId: user.id,
      conversationId: input.conversationId,
      imageUrl: input.imageUrl,
    },
    include: {
      author: true,
      conversation: true
    }
  });

  PusherClient.trigger(
    newMessage.conversation.userIds.find(el => el !== user.id) || "", 
    NotificationType.MESSAGE, 
    newMessage
  );

  return newMessage;
};

export const fetchMessagesResolver = async (
  { user }: Session,
  input: any
): Promise<{ messages: (Message & { author: User })[], hasMore: boolean }> => {
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
    .filter(message => !message.seen && message.authorId !== user.id)
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
    seen: message.authorId === user.id ? message.seen : true,
  }));

  const totalCount = await prisma.message.count({
    where: {
      conversationId: input.conversationId,
    },
  });

  const hasMore = skip + (input.perPage as number) < totalCount;

  return { messages: updatedMessages, hasMore };
}
