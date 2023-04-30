import { Message, User } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";

const Message = ({ data }: { data: Message & { author: User } }) => {
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

export default Message;