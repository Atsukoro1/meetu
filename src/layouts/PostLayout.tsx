import Post, { ExtendedPost } from "@/components/Post";
import PostInput from "@/components/PostInput";
import Skeleton from "@/components/Skeleton";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Post as PostI, User } from "@prisma/client";
import { api } from "@/utils/api";
import { Box, Button, Center, Grid, Group, ScrollArea, Title, createStyles } from "@mantine/core";
import { ProfileCard } from "@/components/ProfileCard";
import ProfileHighlight, { ExtendedUser } from "@/components/ProfileHighlight";
import Tip from "@/components/Tip";

const useStyles = createStyles((_) => ({
    cardsContainer: {
        flex: 1,
        flexDirection: "column"
    },

    profileTip: {
        marginTop: "10px"
    }
}));

const PostLayout = ({ recentUsers, userWithoutSensitiveData }: { recentUsers: User[]; userWithoutSensitiveData: ExtendedUser }) => {
    const { classes } = useStyles();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [cachedPosts, setCachedPosts] = useState<PostI[]>([]);
    const posts = api.post.fetchPosts.useQuery({
        page: currentPage,
        perPage: 10
    }, {
        onSuccess: (data: any) => {
            const copied = [...cachedPosts];

            data.posts.forEach((el: PostI) => {
                const alreadyExists = copied.some((existingItem: PostI) => existingItem.id === el.id);

                if (!alreadyExists) {
                    copied.push(el);
                }
            });

            setCachedPosts(copied);
        }
    });

    const onNewPost = (data: ExtendedPost) => {
        const copied = [...cachedPosts];

        copied.unshift(data);
        setCachedPosts(copied);
    };

    return (
        <Grid>
            <Grid.Col span={4}>
                <ProfileHighlight user={userWithoutSensitiveData} />

                <Center className={classes.profileTip}>
                    <Tip actionText="to create a new post" keys={["ctrl", "+", "p"]} />
                </Center>
            </Grid.Col>

            <Grid.Col span={4}>
                <PostInput onCreate={(data) => onNewPost(data)} />

                <ScrollArea sx={{ gap: 10 }} h={"80vh"} className={classes.cardsContainer}>
                    {cachedPosts.map((el: any) => {
                        return (
                            <Box mb={10}>
                                <Post
                                    post={el}
                                    key={el.id}
                                />
                            </Box>
                        )
                    })}

                    {posts.data?.hasMore && (
                        <Button
                            mb={20}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            variant="outline"
                            loading={posts.isLoading}
                            w={"100%"}
                        >
                            Load more posts
                        </Button>
                    )}
                </ScrollArea>
            </Grid.Col>

            <Grid.Col span={4}>
                <div className="flex flex-row gap-2">
                    <Title mb={5} size="20">Who to follow</Title>
                </div>

                <div className="flex flex-col gap-4">
                    {recentUsers.map((el: User) => {
                        return (
                            <ProfileCard key={el.id} user={el} />
                        )
                    })}
                </div>
            </Grid.Col>
        </Grid>
    )
}

export default PostLayout;