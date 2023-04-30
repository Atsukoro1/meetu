import { env } from "@/env.mjs";
import { Message, NotificationType, User } from "@prisma/client";
import { atom } from "jotai";
import Pusher from 'pusher-js';

type Notification = {
    type: NotificationType;
    data: any;
};

export const NotificationPoolAtom = atom<Notification[]>([]);

export const NotificationReceiverAtom = atom("", (get, set, userId: string) => {
    const PusherClient = new Pusher("e7cda9512707871ade67", {
        cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER
    });

    const channel = PusherClient.subscribe(userId);

    channel.bind(NotificationType.MESSAGE, (data: Message) => {
        set(NotificationPoolAtom, [
            ...get(NotificationPoolAtom), 
            {
                type: NotificationType.MESSAGE,
                data: data
            }
        ]);
    });

    channel.bind(NotificationType.FOLLOW, (data: User) => {
        set(NotificationPoolAtom, [
            ...get(NotificationPoolAtom), 
            {
                type: NotificationType.FOLLOW,
                data: data
            }
        ]);
    });

    return () => {
        channel.unbind_all();
        channel.unsubscribe();
    };
});