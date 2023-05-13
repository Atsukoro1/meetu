import { createStyles, Text, Avatar, Group, Paper, ActionIcon, Popover, HoverCard } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Attachment, Post, User } from '@prisma/client';
import moment from 'moment';
import { FaBookmark, FaRegThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { ProfileCard, ProfileHighlightCard } from './ProfileCard';
import PostContent from './PostContent';

const useStyles = createStyles((theme) => ({
    body: {
        marginBottom: 10,
        paddingTop: theme.spacing.sm,
    },

    border: {
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
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

    action: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        }),
    },
}));

interface PostSimpleProps {
    post: ExtendedPost;
}

export type ExtendedPost = Post & {
    author: User;
    userLiked: boolean;
    userDisliked: boolean;
    attachment: Attachment | null;
    likeCount: number;
    dislikeCount: number;
};

export function PostSimple({ post }: PostSimpleProps) {
    const { classes } = useStyles();

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
                    <PostContent content={post.content}/>
                </Text>

                <Group spacing={8} mr={0}>
                    <ActionIcon className={classes.action}>
                        <FaThumbsUp size="1rem" />
                    </ActionIcon>
                    <ActionIcon className={classes.action}>
                        <FaRegThumbsDown size="1rem" />
                    </ActionIcon>
                    <ActionIcon className={classes.action}>
                        <FaBookmark size="1rem" />
                    </ActionIcon>
                </Group>

                <HoverCard.Dropdown sx={{ pointerEvents: 'none' }}>
                    <ProfileHighlightCard user={post.author} />
                </HoverCard.Dropdown>
            </HoverCard>
        </Paper>
    );
}

export default PostSimple;