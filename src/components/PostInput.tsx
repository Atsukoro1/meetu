import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import AttachmentPanel from "./AttachmentPanel";
import Image from "next/image";
import { env } from "@/env.mjs";
import { Attachment, Post } from "@prisma/client";
import { ExtendedPost } from "./Post";

const PostInput = ({ onCreate }: { onCreate: (data: ExtendedPost) => void; }) => {
    const createPost = api.post.createPost.useMutation({
        onSuccess: (data: ExtendedPost) => {
            onCreate(data)
        }
    });

    const session = useSession();

    const [newAttachment, setNewAttachment] = useState<Attachment | null>(null);

    const [data, setData] = useState<{ content: string, attachmentId: string }>({
        content: "",
        attachmentId: newAttachment?.id ?? ""
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
                        setNewAttachment(null);
                    }}
                >
                    Publish
                </button>
            </div>

            {(newAttachment && newAttachment.type.startsWith("image")) && (
                <Image
                    src={`${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/attachment/${newAttachment.id}`}
                    height={150}
                    alt="upload"
                    className="rounded-lg"
                    width={150}
                />
            )}

            {(newAttachment && newAttachment.type.startsWith("video")) && (
                <video
                    src={`${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/attachment/${newAttachment.id}`}
                    height={150}
                    className="rounded-lg"
                    controls
                    width={150}
                />
            )}

            <AttachmentPanel onAttachment={(attach) => setNewAttachment(attach)} />
        </div>
    )
};

export default PostInput;