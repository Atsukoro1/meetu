import { FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
import { BiCommentDetail } from 'react-icons/bi';
import { Attachment as AttachmentI, Post, User } from '@prisma/client';
import { api } from '@/utils/api';
import { useState } from 'react';
import Link from 'next/link';
import PostModal from './PostModal';
import Attachment from './Attachment';
import moment from 'moment';

export type ExtendedPost = Post & {
    author: User;
    userLiked: boolean;
    userDisliked: boolean;
    attachment: AttachmentI | null;
    likeCount: number;
    dislikeCount: number;
};

const PostComponent = ({ post }: { post: ExtendedPost }) => {
    const [commentModalOpen, setCommentModalOpen] = useState<boolean>(false);
    const toggleInteraction = api.post.toggleInteraction.useMutation();
    const [disliked, setDisliked] = useState<boolean>(post.userDisliked);
    const [liked, setLiked] = useState<boolean>(post.userLiked);
    const [likedCount, setLikedCount] = useState<number>(post.likeCount);
    const [dislikedCount, setDislikedCount] = useState<number>(post.dislikeCount);


    const changeLiked = (to: boolean) => {
        if (disliked) {
            setDisliked(false);
            setDislikedCount(dislikedCount - 1);
        }

        if (to) {
            setLikedCount(likedCount + 1);
        } else {
            setLikedCount(likedCount - 1);
        }

        setLiked(to);
    };

    const changeDisliked = (to: boolean) => {
        if (liked) {
            setLiked(false);
            setLikedCount(likedCount - 1);
        }

        if (to) {
            setDislikedCount(dislikedCount + 1);
        } else {
            setDislikedCount(dislikedCount - 1);
        }

        setDisliked(to);
    };

    return (
        <div className="bg-neutral p-5 rounded-lg flex flex-row">
            <Link href={`/profile/${post.author.slug}`} className="avatar">
                <div className="w-14 h-14 rounded-xl">
                    <img src={post.author.image || ''} />
                </div>
            </Link>

            <div className="ml-5">
                <Link href={`/profile/${post.author.slug}`} className="flex flex-row gap-1">
                    <h2 className="font-semibold text-md">{post.author.name}</h2>
                    <label className="ml-1.5">@{post.author.slug}</label>
                    <label className='ml-2 opacity-30'>{moment(post.createdAt).fromNow()}</label>
                </Link>

                <div className="table w-[375px]">{post.content}</div>

                <Attachment data={post.attachment} />

                <div className="flex flex-row gap-2 mt-2">
                    <div className='flex flex-row gap-2'>
                        <FaRegThumbsUp
                            onClick={() => {
                                toggleInteraction.mutateAsync({
                                    postId: post.id,
                                    type: 'LIKE',
                                });
                                changeLiked(liked ? false : true);
                            }}
                            size={25}
                            className={`hover:cursor-pointer ${liked && 'text-primary'}`}
                        />

                        {likedCount}
                    </div>

                    <div className='flex flex-row gap-2'>
                        <FaRegThumbsDown
                            onClick={() => {
                                toggleInteraction.mutateAsync({
                                    postId: post.id,
                                    type: 'DISLIKE',
                                });
                                changeDisliked(disliked ? false : true);
                            }}
                            size={25}
                            className={`hover:cursor-pointer ${disliked && 'text-primary'}`}
                        />

                        {dislikedCount}
                    </div>

                    <label onClick={() => setCommentModalOpen(true)}>
                        <BiCommentDetail
                            size={25}
                            className={`hover:cursor-pointer`}
                        />
                    </label>
                </div>
            </div>

            {commentModalOpen && (
                <PostModal
                    onClose={() => setCommentModalOpen(false)}
                    visible={commentModalOpen}
                    post={post}
                />
            )}
        </div>
    )
};

export default PostComponent;