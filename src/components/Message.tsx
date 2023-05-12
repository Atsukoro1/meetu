import { Message, User } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";

export const MessagePlaceholder = () => {
    return (
        <div className="chat chat-start">
            <div className="avatar chat-image placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                    <span className="text-xl">JO</span>
                </div>
            </div>
            <div className="chat-header">
                Example username
                <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">Example longer chat message!</div>
            <div className="chat-footer opacity-50">
                Delivered
            </div>
        </div>
    )
};

export const MessageRenderer = ({ data }: { data: Message & { author: User } }) => {
    const session = useSession();
    const isAuthor = data.authorId === session.data?.user.id;

    return (
        <div className={`chat ${isAuthor ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={data.author.image || ""} />
                </div>
            </div>
            <div className="chat-header flex flex-row gap-2">
                {data.author.name}
                <time className="text-xs opacity-50">{moment(data.createdAt).fromNow()}</time>
            </div>
            <div className={`chat-bubble ${isAuthor && "bg-primary bg-opacity-50"}`}>{data.content}</div>
            <div className="chat-footer opacity-50">
                {(isAuthor && data.seen) && (
                    <label>Seen</label>
                )}
            </div>
        </div>
    )
}