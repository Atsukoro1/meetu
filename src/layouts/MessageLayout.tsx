import { api } from "@/utils/api";
import { Message, User } from "@prisma/client";
import { AiOutlineSend } from 'react-icons/ai';
import moment from "moment";
import { useSession } from "next-auth/react";
import { useState } from "react";

const MessageLayout = () => {
    const [selected, setSelected] = useState<string>("");
    const [newMessage, setNewMessage] = useState<string>("");
    const [cached, setCached] = useState<(Message & { author: User })[]>([]);
    const session = useSession();

    const createNewMessage = api.conversation.createMessage.useMutation();
    const messages = api.conversation.fetchMesssages.useMutation({
        onSuccess: (data) => {
            const copied = [...cached];

            data.forEach(el => {
                // @ts-ignore
                if (!copied.some(item => item.id === el.id)) copied.push(el);
            });

            setCached(copied);
        }
    });

    const conversations = api.conversation.fetch.useQuery(undefined, {
        onSuccess: (data) => {
            setSelected(data[0]?.id ?? "");
            messages.mutateAsync({ conversationId: selected });
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
                {cached.map(el => {
                    return (
                        <div className={`chat ${el.authorId === session.data?.user.id ? "chat-end" : "chat-start"}`}>
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img src={el.author.image || ""} />
                                </div>
                            </div>
                            <div className="chat-header flex flex-row gap-2">
                                {el.author.name}
                                <time className="text-xs opacity-50">{moment(el.createdAt).fromNow()}</time>
                            </div>
                            <div className="chat-bubble">{el.content}</div>
                            <div className="chat-footer opacity-50">
                                Delivered
                            </div>
                        </div>
                    )
                })}

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
