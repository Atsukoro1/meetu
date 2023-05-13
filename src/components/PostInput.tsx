import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AttachmentPanel from "./AttachmentPanel";
import Image from "next/image";
import { env } from "@/env.mjs";
import { Attachment } from "@prisma/client";
import { ExtendedPost } from "./Post";
import { ProfileSearchResult } from "./ProfileCard";

const PostInput = ({ onCreate }: { onCreate: (data: ExtendedPost) => void; }) => {
    const createPost = api.post.createPost.useMutation({
        onSuccess: (data: ExtendedPost) => {
            onCreate(data)
        }
    });

    const [mention, setMention] = useState<string | null>(null);
    const searchUsers = api.user.searchUsers.useQuery(
        mention ? mention.replace("@", "")
            : null
    );

    const session = useSession();

    const [newAttachment, setNewAttachment] = useState<Attachment | null>(null);

    const [data, setData] = useState<{ content: string, attachmentId: string }>({
        content: "",
        attachmentId: ""
    });

    useEffect(() => {
        setData({
            ...data,
            attachmentId: newAttachment?.id ?? ""
        })
    }, [newAttachment]);

    const onNewPost = async () => {
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
    }

    return (
        <div className="bg-neutral p-4 rounded-lg">
            <div className="flex w-full mb-4 mx-auto flex-row gap-4">
                <div className="avatar">
                    <div className="w-12 h-12 rounded-xl">
                        <img src={session.data?.user.image || ""} />
                    </div>
                </div>

                <input
                    onKeyDown={(event) => {
                        if(event.key === 'Enter') onNewPost();
                    }}
                    type="text"
                    value={data.content}
                    onChange={(e) => {
                        setData({
                            ...data,
                            content: e.target.value,
                        });

                        const lastWord = e.target.value.split(" ").pop() || "";
                        if (lastWord.startsWith('@') && lastWord.length !== 1) {
                            setMention(lastWord);
                        } else {
                            setMention(null);
                        }
                    }}
                    placeholder="New post content..."
                    className="input input-bordered input-primary w-full"
                />

                <button
                    className="btn btn-primary"
                    onClick={onNewPost}
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

            {searchUsers.data?.map(el => {
                return (
                    <ProfileSearchResult
                        user={el}
                        onClick={() => {
                            const updatedContent = data.content.replace(mention ?? '', `@${el.slug}`);
                            setData({
                                ...data,
                                content: updatedContent
                            });
                            setMention(null);
                        }}
                    />
                );
            })}

            <AttachmentPanel onAttachment={(attach) => setNewAttachment(attach)} />
        </div>
    )
};

export default PostInput;
