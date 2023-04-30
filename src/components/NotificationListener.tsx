import { NotificationReceiverAtom } from "@/atoms/NotificationPoolAtom";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const NotificationListener = () => {
    const [_, setNotifications] = useAtom(NotificationReceiverAtom);

    const session = useSession();

    useEffect(() => setNotifications(
        session.data?.user.id || ""
    ), [session.data?.user.id, setNotifications]);

    return <></>
}

export default NotificationListener;