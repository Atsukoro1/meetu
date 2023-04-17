import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";

const PostInput = ({ onRefresh }: { onRefresh: () => void; }) => {
    const createPost = api.post.createPost.useMutation({
        onSuccess: () => onRefresh()
    });
    
    const session = useSession();

    const [data, setData] = useState<{ content: string }>({
        content: ""
    });

    return (
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
                        content: data.content
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
    )
};

export default PostInput;