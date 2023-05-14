import { IoMdSend } from 'react-icons/io';
import { ExtendedPost } from "./Post";
import { useState } from 'react';
import { api } from '@/utils/api';
import { Comment, Post, User } from '@prisma/client';
import { Avatar, Button, Text, Group, Input, Pagination, Paper, TypographyStylesProvider, createStyles, rem, Flex, Grid } from '@mantine/core';
import moment from 'moment';
import PostContent from './PostContent';

type PostModalCommentInputPropsI = {
    post: ExtendedPost;
    onCreatePost: (value: Comment) => void;
}

const useStyles = createStyles((theme) => ({
    comment: {
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
    },

    body: {
        paddingLeft: rem(54),
        paddingTop: theme.spacing.sm,
        fontSize: theme.fontSizes.sm,
    },

    content: {
        '& > p:last-child': {
            marginBottom: 0,
        },
        marginTop: 10
    },

    container: {
        gap: 10
    }
}));

const PostModalCommentInput = ({ post, onCreatePost }: PostModalCommentInputPropsI) => {
    const createComment = api.post.createPostComment.useMutation({
        onSuccess: (data) => { onCreatePost(data) }
    });

    const [content, setContent] = useState<string>("");

    const onPostCreate = () => {
        createComment.mutateAsync({
            content: content,
            postId: post.id
        });

        setContent("");
    }

    return (
        <Grid>
            <Grid.Col span={8}>
                <Input
                    type="text"
                    placeholder="Comment this post..."
                    value={content}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') onPostCreate()
                    }}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />
            </Grid.Col>

            <Grid.Col span={4}>
                <Button
                    color='primary'
                    rightIcon={<IoMdSend color='white' size={25} />}
                    variant="filled"
                    onClick={onPostCreate}
                >
                    Send
                </Button>
            </Grid.Col>
        </Grid>
    )
}

const PostModalBlockComment = ({ comment }: { comment: Comment & { author: User, post: Post } }) => {
    const { classes } = useStyles();

    return (
        <Paper mb={15} withBorder radius="md" className={classes.comment}>
            <Group spacing={10}>
                <Avatar src={comment.author.image} radius="xl" />
                <div>
                    <Text fz="sm">{comment.author.name}</Text>
                    <Text fz="xs" c="dimmed">
                        {moment(comment.createdAt).fromNow()}
                    </Text>
                </div>
            </Group>

            <Text className={classes.content}>
                <PostContent content={comment.content} />
            </Text>
        </Paper>
    )
}

const PostComments = ({ post }: { post: ExtendedPost }) => {
    const { classes } = useStyles();
    const [page, setPage] = useState<number>(1);
    const comments = api.post.fetchPostComments.useQuery({
        page: page,
        perPage: 5,
        postId: post.id
    });

    return (
        <Group className={classes.container} display="block">
            <PostModalCommentInput
                onCreatePost={() => { comments.refetch(); }}
                post={post}
            />

            <Group mt={20} mb={20} display="block">
                {(comments.isLoading || !comments.data) ? (
                    <>
                        Loading
                    </>
                ) : (
                    comments.data.comments.map(el => {
                        return (
                            <PostModalBlockComment comment={el} />
                        )
                    })
                )}
            </Group>

            {comments.data?.commentsCount !== 0 && <Pagination
                total={comments.data?.commentsCount || 0}
                onChange={setPage}
                value={page}
            />}
        </Group >
    )
}

export default PostComments;