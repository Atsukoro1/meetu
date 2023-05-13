import Notification from "@/components/Notification";
import Skeleton from "@/components/Skeleton";
import { api } from "@/utils/api";
import { Notification as NotificationI } from "@prisma/client";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

const NotificationLayout = () => {
    const [cachedNotifications, setCachedNotifications] = useState<NotificationI[]>([]);
    const [page, setPage] = useState<number>(1);
    const data = api.notification.fetchNotifications.useQuery({
        page: page,
        perPage: 5
    }, {
        onSuccess: (data) => {
            const copied = [...cachedNotifications];
            data.notifications.forEach(el => {
                const alreadyExists = copied.some(existingItem => existingItem.id === el.id);

                if (!alreadyExists) {
                    copied.push(el);
                }
            });
    
            setCachedNotifications(copied);
        }
    });
    

    return (
        <div className="w-[45%] p-3 flex h-[90vh] overflow-scroll flex-col gap-4">
            <h1 className='text-3xl font-bold'>Notifications</h1>

            <InfiniteScroll
                className="mt-4"
                pageStart={1}
                loadMore={() => {
                    setPage(page + 1);
                }}
                hasMore={data.data?.hasMorePages}
                loader={
                    <div className="gap-4 flex flex-col">
                        <Skeleton height="120px" width="100%" />
                        <Skeleton height="120px" width="100%" />
                        <Skeleton height="120px" width="100%" />
                    </div>
                }
                useWindow={false}
            >
                <div className="flex flex-col gap-3">
                    {cachedNotifications.map(el => {
                        return (<Notification data={el} />)
                    })}
                </div>
            </InfiniteScroll>
        </div>
    )
}

export default NotificationLayout;