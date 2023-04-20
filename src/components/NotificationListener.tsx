import { env } from "@/env.mjs";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useEffect } from "react";

const PusherClient = new Pusher("e7cda9512707871ade67", {
    cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER
});

const NotificationListener = () => {
    const { data } = useSession();

    useEffect(() => {
        if (!data) return;

        PusherClient.connect();

        const channel = PusherClient.subscribe((data as any).user.id);

        channel.bind("follow", (data: User) => {
            alert("Follow");
        });
    }, []);

    return <></>
};

export default NotificationListener;