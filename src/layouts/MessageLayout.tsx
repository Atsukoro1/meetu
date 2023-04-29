import { AiOutlineSend } from 'react-icons/ai';
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "@/components/Skeleton";
import Message from "@/components/Message";
import { User } from "@prisma/client";
import { api } from "@/utils/api";

const MessageLayout = () => {
    const [page, setPage] = useState<number>(1);

    const [selected, setSelected] = useState<string>("");
    
    useEffect(() => {
        setCached([]);
        setPage(1);
    }, [selected]);

    const [newMessage, setNewMessage] = useState<string>("");
    const [cached, setCached] = useState<(Message & { author: User })[]>([]);

    const createNewMessage = api.conversation.createMessage.useMutation({
        onSuccess: (object) => {
            setCached([...cached, object]);
        }
    });

    const messages = api.conversation.fetchMesssages.useQuery({
        page: page,
        perPage: 10,
        conversationId: selected
    },{
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

    const handleNewMessage = () => {
        createNewMessage.mutateAsync({
            content: newMessage,
            imageUrl: null,
            conversationId: selected
        });

        setNewMessage("");
    };

    return (
        <div className="w-[45%] p-3 d-flex flex-column justify-content-between">
            <div className="tabs tabs-boxed">
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
            <div className="flex flex-col gap-2 h-[72vh] overflow-scroll p-4">
            <InfiniteScroll
                pageStart={1}
                loadMore={() => {
                    setPage(page + 1);
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
                        return <Message data={el}/>
                    })}
                </div>
            </InfiniteScroll>

                <div className="absolute bottom-5 flex flex-row mx-auto w-fit gap-3">
                    <input
                        className="input input-bordered w-full"
                        placeholder="Say hi!"
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                    />

                    <button onClick={handleNewMessage} className="btn btn-primary">
                        Send

                        <AiOutlineSend color="black" size={20} className="ml-3"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageLayout;
