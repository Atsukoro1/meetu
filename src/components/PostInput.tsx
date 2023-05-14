import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { env } from "@/env.mjs";
import { Attachment } from "@prisma/client";
import { ExtendedPost } from "./Post";
import { Text, Button, Flex, Modal, TextInput, createStyles, Group, Col, Paper, Overlay, AspectRatio, Grid } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { streamToFile, uploadFile } from "@/utils/supabase";
import { Duplex } from 'stream';
import { FaCross, FaTrash } from "react-icons/fa";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles((theme) => ({
    avatar: {
        image: {
            height: 50,
            width: 50
        }
    },

    input: {
        width: "100%"
    },

    dropTip: {
        marginTop: "10px"
    },

    uploadedImage: {
        borderRadius: "19px",
        overflow: "hidden",
        cursor: 'pointer'
    },

    uploadedImageContainer: {
        marginTop: "5px"
    }
}));

const PostInput = ({ onCreate }: { onCreate: (data: ExtendedPost) => void; }) => {
    const [files, setFiles] = useState<File[]>([]);
    const createAttachment = api.post.createPostAttachment.useMutation();
    const [opened, { open, close }] = useDisclosure();
    const { classes, theme } = useStyles();
    const [attachments, setAttachments] = useState<string[]>([]);
    const [data, setData] = useState({
        content: "",
        attachmentId: ""
    })

    const createPost = api.post.createPost.useMutation({
        onSuccess: (data: ExtendedPost) => {
            onCreate(data)
        }
    });

    const onNewPost = async () => {
        await createPost.mutateAsync({
            content: data.content,
            ...data.attachmentId && {
                attachmentId: data.attachmentId
            }
        });

        setData({
            attachmentId: "",
            content: ""
        });
        setFiles([]);

        showNotification({
            title: "New post",
            message: "New post has been successfully created!",
            autoClose: 3000
        });

        close();
    }

    const onFileRemove = (index: number) => {
        setFiles((prev) => prev.filter((file: File, i) => i !== index));
    };

    const onFileUpload = async (file: FileWithPath) => {
        const result = await createAttachment.mutateAsync({
            type: file.type
        });

        const toUpload = await streamToFile(file.stream(), file.name, file.type);

        if (await uploadFile(
            `attachment/${result.id}`,
            toUpload,
            "test"
        )) {
            setData({
                ...data,
                attachmentId: result.id
            });

            setFiles([...files, toUpload]);
        };
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
            <Flex gap={10} className="flex w-full mb-4 mx-auto flex-row gap-4">
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
            </Flex>

            {files.length === 0 && (
                <Text size="xs" className={classes.dropTip}>
                    <b>Tip</b>:
                    Drop file anywhere on screen
                </Text>
            )}

            <Grid className={classes.uploadedImageContainer}>
                {files.map((file, index) => (
                    <Grid.Col onClick={() => onFileRemove(index)} span={4}>
                        <AspectRatio ratio={13 / 9} maw={150} mx="auto" className={classes.uploadedImage}>
                            <Image
                                src={URL.createObjectURL(file)}
                                alt={`Image ${index}`}
                                width={50}
                                height={50}
                            />
                            <Overlay blur={2} center>
                                <FaTrash color="white" />
                            </Overlay>
                        </AspectRatio>
                    </Grid.Col>
                ))}
            </Grid>

            <Dropzone.FullScreen
                active={true}
                accept={IMAGE_MIME_TYPE}
                onDrop={(files) => {
                    if (files[0]) onFileUpload(files[0]);
                }}
            >
                <Group position="center" spacing="xl" mih={220} sx={{ pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                        <IconUpload
                            size="3.2rem"
                            stroke={1.5}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto size="3.2rem" stroke={1.5} />
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag images here or click to select files
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Attach as many files as you like, each file should not exceed 5mb
                        </Text>
                    </div>
                </Group>
            </Dropzone.FullScreen>
        </Modal>
    )
};

export default PostInput;
