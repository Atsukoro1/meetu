import Notification from "@/components/Notification";
import { api } from "@/utils/api";

const NotificationLayout = () => {
    const notifications = api.notification.fetchNotifications.useQuery({
        page: 1,
        perPage: 10
    });

    return (
        <div className="w-[45%] p-3">
            {!notifications.isLoading && (
                notifications.data?.map(el => {
                    return (<Notification data={el}/>)
                })
            )}
        </div>
    )
}

export default NotificationLayout;