import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AttachmentPanel from "./AttachmentPanel";
import Image from "next/image";
import { env } from "@/env.mjs";
import { Attachment } from "@prisma/client";
import { ExtendedPost } from "./Post";
import { Avatar, Button, Modal, TextInput, createStyles } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
    avatar: {
        image: {
            height: 50,
            width: 50
        }
    },

    input: {
        width: "100%"
    }
}));

const PostInput = ({ onCreate }: { onCreate: (data: ExtendedPost) => void; }) => {
    const [opened, { open, close }] = useDisclosure();
    const { classes } = useStyles();

    const createPost = api.post.createPost.useMutation({
        onSuccess: (data: ExtendedPost) => {
            onCreate(data)
        }
    });

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

    useEffect(() => {
        function handleKeyPress(event: any) {
            if (event.ctrlKey && event.key === 'p') {
              open();
              event.preventDefault();
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <Modal 
            opened={opened} 
            onClose={close} 
            title="Create a new post" 
            className="bg-neutral p-4 rounded-lg"
        >
            <div className="flex w-full mb-4 mx-auto flex-row gap-4">
                <div className="avatar">
                    <Avatar
                        src={session.data?.user.image}
                        alt="it's me"
                        className={classes.avatar}
                        size="md"
                    />
                </div>

                <TextInput
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') onNewPost();
                    }}
                    placeholder="New post content..."
                    className={classes.input}
                    size="md"
                    value={data.content}
                    onChange={(e) => {
                        setData({
                            ...data,
                            content: e.target.value,
                        });
                    }}
                />

                <Button
                    onClick={() => onNewPost()}
                    size="md"
                >
                    Post
                </Button>
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
        </Modal>
    )
};

export default PostInput;
