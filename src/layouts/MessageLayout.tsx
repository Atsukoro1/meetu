import { AiOutlineSend } from 'react-icons/ai';
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "@/components/Skeleton";
import { MessageRenderer } from "@/components/Message";
import { NotificationType, User, Message as MessageType } from "@prisma/client";
import { api } from "@/utils/api";
import { useAtom } from 'jotai';
import { NotificationPoolAtom } from '@/atoms/NotificationPoolAtom';
import Tip from '@/components/Tip';

const MessageLayout = () => {
    const [page, setPage] = useState<number>(1);
    const [notifications, setNotifications] = useAtom(NotificationPoolAtom);

    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        setCached([]);
        setPage(1);
    }, [selected]);

    const [newMessage, setNewMessage] = useState<string>("");
    const [cached, setCached] = useState<(MessageType & { author: User })[]>([]);

    const createNewMessage = api.conversation.createMessage.useMutation({
        onSuccess: (object) => {
            setCached([...cached, object]);
        }
    });

    const messages = api.conversation.fetchMesssages.useQuery({
        page: page,
        perPage: 10,
        conversationId: selected
    }, {
        onSuccess: (data) => {
            const copied = [...cached];

            data.messages.forEach(el => {
                // @ts-ignore
                if (!copied.some(item => item.id === el.id)) copied.unshift(el);
            });

            setCached(copied);
        }
    });

    const conversations = api.conversation.fetch.useQuery(undefined, {
        onSuccess: (data) => {
            setSelected(data[0]?.id ?? "");
        }
    });

    useEffect(() => {
        notifications.forEach(notification => {
            if (notification.type === NotificationType.MESSAGE) {
                const message = notification.data as MessageType;
                if (message.conversationId === selected) {
                    const copied = [...cached];
                    let index = copied.findIndex(msg => msg.createdAt > message.createdAt);
                    if (index === -1) index = copied.length;
                    // @ts-ignore
                    copied.splice(index, 0, { ...message, author: message.author });
                    setCached(copied);

                    setNotifications(notifications.filter(n => n !== notification));
                }
            }
        });
    }, [notifications, selected, cached, setNotifications]);

    const handleNewMessage = () => {
        createNewMessage.mutateAsync({
            content: newMessage,
            imageUrl: null,
            conversationId: selected
        });

        setNewMessage("");
    };

    return (
        <div className="w-[45%] pr-3 pl-3 d-flex flex-column justify-content-between">
            <div className="tabs tabs-boxed flex mt-3 flex-row">
                {conversations.data?.map(el => {
                    return (
                        <a
                            className={`tab ${selected === el.id && 'tab-active'}`}
                            onClick={() => setSelected(el.id)}
                        >
                            {el.title}
                        </a>
                    )
                })}
            </div>
            <div className="flex flex-col gap-2 h-[69vh] overflow-scroll p-4">
                <InfiniteScroll
                    pageStart={1}
                    loadMore={() => {
                        setPage(page +
                            1);
                    }}
                    hasMore={messages.data?.hasMore}
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
                        {cached.map(el => {
                            return <MessageRenderer data={el} />
                        })}
                    </div>
                </InfiniteScroll>
            </div>

            {selected !== "" && (
                <div className="mt-4 mx-auto w-fit gap-3">
                    <div className='mx-auto w-fit'>
                        <Tip
                            actionText='to send message'
                            keys={[
                                "Enter"
                            ]}
                        />
                    </div>

                    <div className='mt-3 flex flex-row gap-3'>
                        <input
                            className="input input-bordered w-full"
                            onKeyDown={(event) => {
                                if(event.key == 'Enter') 
                                    handleNewMessage();
                            }}
                            placeholder="Your message..."
                            value={newMessage}
                            onChange={(event) => setNewMessage(event.target.value)}
                        />

                        <button onClick={handleNewMessage} className="btn btn-primary">
                            Send

                            <AiOutlineSend color="white" size={20} className="ml-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

}

export default MessageLayout;