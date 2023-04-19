import { env } from "@/env.mjs";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaUserFriends } from 'react-icons/fa';

interface Notification {
    title: string;
    subtitle: string;
    icon: IconType;
}

const PusherClient = new Pusher("e7cda9512707871ade67", {
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER
});

const NotificationListener = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { data } = useSession();

    const addNotification = (data: Notification) => {
        notifications.push(data);
        setNotifications(notifications);

        setTimeout(() => {
            notifications.shift();
            setNotifications(notifications);
        }, 3000);
    }

    useEffect(() => {
        if (!data) return;

        PusherClient.connect();

        const channel = PusherClient.subscribe((data as any).user.id);

        channel.bind("follow", (data: User) => {
            addNotification({
                title: "New follow",
                subtitle: `User ${data.name} just followed you!`,
                icon: FaUserFriends
            });
        });
    }, []);

    return (
        <div className="toast toast-end">
            {notifications.map(el => {
                return (
                    <div className="alert alert-success">
                 <div>
                   <span>{el.title}</span>
                 </div>
               </div>
                )
            })}
        </div>
    )
};

export default NotificationListener;