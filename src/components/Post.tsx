import { createStyles, Text, Avatar, Group, Paper, ActionIcon, HoverCard, Flex, Modal, Image } from '@mantine/core';
import { Attachment as AttachmentI, Post, User } from '@prisma/client';
import moment from 'moment';
import { FaRegComment, FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { ProfileHighlightCard } from './ProfileCard';
import PostContent from './PostContent';
import { useState } from 'react';
import { api } from '@/utils/api';
import { useDisclosure } from '@mantine/hooks';
import PostComments from './PostComments';
import { env } from '@/env.mjs';

const useStyles = createStyles((theme) => ({
    body: {
        marginBottom: 10,
        paddingTop: theme.spacing.sm,
    },

    border: {
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
        width: "100%"
    },

    avatar: {
        image: {
            height: 50,
            width: 50
        }
    },

    avatarContainer: {
        "&:hover": {
            cursor: "pointer"
        },
        width: '40%'
    },

    postImage: {
        borderRadius: "10px",
        overflow: "hidden"
    }
}));

interface PostSimpleProps {
    post: ExtendedPost;
}

export type ExtendedPost = Post & {
    author: User;
    userLiked: boolean;
    userDisliked: boolean;
    attachment: AttachmentI | null;
    likeCount: number;
    dislikeCount: number;
};

export function PostSimple({ post }: PostSimpleProps) {
    const toggleInteraction = api.post.toggleInteraction.useMutation();
    const [modalOpened, { open, close }] = useDisclosure();

    const [reactions, setReactions] = useState({
        liked: post.userLiked,
        disliked: post.userDisliked
    });
    const [counts, setCounts] = useState({
        likedCount: post.likeCount,
        dislikedCount: post.dislikeCount
    });

    const { classes } = useStyles();

    const onInteractionClick = (type: 'DISLIKE' | 'LIKE') => {
        const localOpposite = type === 'DISLIKE' ? 'liked' : 'disliked';
        const localExact = type === 'DISLIKE' ? 'disliked' : 'liked';

        if (reactions[localOpposite]) {
            toggleInteraction.mutate({
                type: type === 'DISLIKE' ? 'LIKE' : "DISLIKE",
                postId: post.id
            });
        };

        toggleInteraction.mutate({
            type: type,
            postId: post.id
        });

        if (localExact === 'disliked') {
            setCounts({
                ...counts,
                ...reactions.liked && {
                    likedCount: counts.likedCount - 1
                },
                dislikedCount: reactions.disliked ? counts.dislikedCount - 1 : counts.dislikedCount + 1
            });
        } else {
            setCounts({
                ...counts,
                ...reactions.disliked && {
                    dislikedCount: counts.dislikedCount - 1,
                },
                likedCount: reactions.liked ? counts.likedCount - 1 : counts.likedCount + 1
            });
        }

        setReactions({
            ...reactions,
            [localExact]: !reactions[localExact],
            ...reactions[localOpposite] && {
                [localOpposite]: false
            }
        });
    }

    return (
        <Paper withBorder radius="md" className={classes.border}>
            <HoverCard width={200} position='bottom' withArrow shadow='md'>
                <HoverCard.Target>
                    <Group className={classes.avatarContainer}>
                        <Avatar
                            src={post.author.image}
                            alt={post.author.name || ""}
                            className={classes.avatar}
                        />

                        <div>
                            <Text size="sm">{post.author.name}</Text>
                            <Text size="xs" color="dimmed">
                                {moment().from(post.createdAt)}
                            </Text>
                        </div>
                    </Group>
                </HoverCard.Target>

                <Text className={classes.body} size="sm">
                    <PostContent content={post.content} />
                </Text>

                {post.attachment && (
                    <Group spacing={5} mt={2} mb={10}>
                        <Image
                            className={classes.postImage}
                            src={`${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/attachment/${post.attachmentId}`}
                            height={140}
                            fit='cover'
                            width={200}
                        />
                    </Group>
                )}

                <Group spacing={8} mr={0}>
                    <Flex>
                        <ActionIcon variant='transparent' onClick={() => onInteractionClick('LIKE')}>
                            {reactions.liked ? <FaThumbsUp size="1rem" /> : <FaRegThumbsUp size="1rem" />}
                        </ActionIcon>
                        <Text>{counts.likedCount}</Text>
                    </Flex>

                    <Flex>
                        <ActionIcon variant='subtle' onClick={() => onInteractionClick('DISLIKE')}>
                            {reactions.disliked ? <FaThumbsDown size="1rem" /> : <FaRegThumbsDown size="1rem" />}
                        </ActionIcon>
                        <Text>{counts.dislikedCount}</Text>
                    </Flex>

                    <ActionIcon variant='transparent' onClick={open}>
                        <FaRegComment size="1rem" />
                    </ActionIcon>
                </Group>

                <HoverCard.Dropdown sx={{ pointerEvents: 'none' }}>
                    <ProfileHighlightCard user={post.author} />
                </HoverCard.Dropdown>
            </HoverCard>

            <Modal opened={modalOpened} onClose={close} title="Post comments">
                <PostComments post={post} />
            </Modal>
        </Paper>
    );
}

export default PostSimple;