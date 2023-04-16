import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { Post, User } from '@prisma/client';
import { api } from '@/utils/api';
import { useState } from 'react';

export type ExtendedPost = Post & {
    author: User;
    userLiked: boolean;
    userDisliked: boolean;
};

const Post = ({ post }: { post: ExtendedPost }) => {
    const toggleInteraction = api.post.toggleInteraction.useMutation();
    const [disliked, setDisliked] = useState<boolean>(post.userDisliked);
    const [liked, setLiked] = useState<boolean>(post.userLiked);

    const changeLiked = (to: boolean) => {
        if (disliked) setDisliked(false);
        setLiked(to);
    }

    const changeDisliked = (to: boolean) => {
        if (liked) setLiked(false);
        setDisliked(to);
    }

    return (
        <div className="bg-neutral p-3 rounded-lg flex flex-row">
            <div className="avatar">
                <div className="w-14 h-14 rounded-xl">
                    <img src={post.author.image || ""} />
                </div>
            </div>

            <div className="ml-3">
                <div className="flex flex-row gap-1">
                    <h2 className="font-semibold text-md">{post.author.name}</h2>
                    <label>@{post.author.slug}</label>
                </div>

                <div>
                    {post.content}
                </div>

                <div className="flex flex-row gap-2 mt-2">
                    <FaRegThumbsUp
                        onClick={() => {
                            toggleInteraction.mutateAsync({
                                postId: post.id,
                                type: 'LIKE'
                            });
                            changeLiked(liked ? false : true);
                        }}
                        size={25}
                        className={`hover:cursor-pointer ${liked && "text-primary"}`}
                    />

                    <FaRegThumbsDown
                        onClick={() => {
                            toggleInteraction.mutateAsync({
                                postId: post.id,
                                type: 'DISLIKE'
                            });
                            changeLiked(disliked ? false : true);
                        }}
                        size={25}
                        className={`hover:cursor-pointer ${disliked && "text-primary"}`}
                    />
                </div>
            </div>
        </div>
    )
}

export default Post;