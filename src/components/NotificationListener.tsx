import { NotificationReceiverAtom } from "@/atoms/NotificationPoolAtom";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Notifications } from '@mantine/notifications';

const NotificationListener = () => {
    const [_, setNotifications] = useAtom(NotificationReceiverAtom);

    const session = useSession();

    useEffect(() => setNotifications(
        session.data?.user.id || ""
    ), [session.data?.user.id, setNotifications]);

    return <Notifications/>
}

export default NotificationListener;