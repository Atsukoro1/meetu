import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import AttachmentPanel from "./AttachmentPanel";

const PostInput = ({ onRefresh }: { onRefresh: () => void; }) => {
    const createPost = api.post.createPost.useMutation({
        onSuccess: () => onRefresh()
    });

    const session = useSession();

    const [data, setData] = useState<{ content: string, attachmentId: string }>({
        content: "",
        attachmentId: ""
    });

    return (
        <div className="bg-neutral p-4 rounded-lg">
            <div className="flex w-full mb-4 mx-auto flex-row gap-4">
                <div className="avatar">
                    <div className="w-12 h-12 rounded-xl">
                        <img src={session.data?.user.image || ""} />
                    </div>
                </div>

                <input
                    type="text"
                    value={data.content}
                    onChange={(e) => {
                        setData({
                            ...data,
                            content: e.target.value
                        });
                    }}
                    placeholder="New post content..."
                    className="input input-bordered input-primary w-full"
                />

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        createPost.mutateAsync({
                            content: data.content,
                            ...data.attachmentId && {
                                attachmentId: data.attachmentId
                            }
                        });

                        setData({
                            ...data,
                            content: ""
                        });
                    }}
                >
                    Publish
                </button>
            </div>

            <AttachmentPanel 
                onAttachment={(url) => {
                    setData({
                        ...data,
                        attachmentId: url
                    });
                }}
            />
        </div>
    )
};

export default PostInput;