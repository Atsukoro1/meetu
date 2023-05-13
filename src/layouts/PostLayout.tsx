import Post, { ExtendedPost } from "@/components/Post";
import PostInput from "@/components/PostInput";
import Skeleton from "@/components/Skeleton";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Post as PostI } from "@prisma/client";
import { api } from "@/utils/api";

const PostLayout = () => {
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
        <div className="w-[45%] pl-3 pr-3">
                <PostInput onCreate={(data) => onNewPost(data)} />

                <div className="flex h-[80vh] flex-col gap-2 overflow-scroll">
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={() => {
                            setCurrentPage(currentPage + 1);
                        }}
                        hasMore={posts.data?.hasMore}
                        loader={
                            <div className="gap-4 flex flex-col">
                                <Skeleton height="120px" width="100%" />
                                <Skeleton height="120px" width="100%" />
                                <Skeleton height="120px" width="100%" />
                            </div>
                        }
                        useWindow={false}
                    >
                        <div className="flex flex-col gap-5">
                            {cachedPosts.map((el: any) => {
                                return (
                                    <Post
                                        post={el}
                                        key={el.id}
                                    />
                                )
                            })}
                        </div>
                    </InfiniteScroll>

                </div>
            </div>
    )
}

export default PostLayout;