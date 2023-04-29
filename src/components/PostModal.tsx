import { IoMdSend } from 'react-icons/io';
import { ExtendedPost } from "./Post";
import { useMemo, useState } from 'react';
import { api } from '@/utils/api';
import { Comment, Post, User } from '@prisma/client';
import { BsArrow90DegUp } from 'react-icons/bs';
import Pagination from './Pagination';

const PostModalCommentInput = ({ post }: { post: ExtendedPost }) => {
    const createComment = api.post.createPostComment.useMutation();
    const [content, setContent] = useState<string>("");

    return (
        <div>
            <div className="form-control">
                <input
                    type="text"
                    placeholder="Comment this post..."
                    className="input input-bordered"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />

                <button
                    className="btn w-[130px] mx-auto mr-0 mt-3 gap-2"
                    onClick={() => {
                        createComment.mutateAsync({
                            content: content,
                            postId: post.id
                        });

                        setContent("");
                    }}
                >
                    Send
                    <IoMdSend color='white' size={25} />
                </button>
            </div>
        </div>
    )
}

const PostModalBlockAuthor = ({ post }: { post: ExtendedPost }) => {
    return (
        <div>
            <div className="flex flex-row">
                <div className="avatar">
                    <div className="w-[80px] h-[80px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={post.author.image as string} />
                    </div>
                </div>

                <div className="ml-5">
                    <h1 className="text-xl font-bold">{post.author.name}</h1>
                    <p className="table w-[380px]">{post.content}</p>
                </div>
            </div>
        </div>
    )
}

const PostModalBlockComment = ({ comment }: { comment: Comment & { author: User , post: Post} }) => {
    return (
        <div>
            <div className="flex flex-row">
                <BsArrow90DegUp size={18}  className='mt-[10px]'/>
                <div className="divider">Replied to original post</div>
            </div>

            <div className="flex flex-row bg-neutral p-4 rounded-lg">
                <div className="avatar">
                    <div className="w-[50px] h-[50px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={comment.author.image as string} />
                    </div>
                </div>

                <div className="ml-5">
                    <h1 className="text-xl font-bold">{comment.author.name}</h1>
                    <p className="table w-[380px]">{comment.content}</p>
                </div>
            </div>
        </div>
    )
}

const PostModal = ({ post, visible, onClose }: { post: ExtendedPost, visible: boolean, onClose: () => void; }) => {
    const open = useMemo(() => visible, [visible]);
    const [page, setPage] = useState<number>(1);
    const comments = api.post.fetchPostComments.useQuery({
        page: page,
        perPage: 5,
        postId: post.id
    });

    return (
        <div>
            <div className={`modal ${open ? 'modal-open' : ""}`}>
                <div className="modal-box">
                    <PostModalBlockAuthor post={post} />

                    <div className="divider"></div>

                    <div className='mb-4'>
                        <PostModalCommentInput post={post} />
                    </div>

                    <div className='mb-4 flex flex-col gap-3'>
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
                    </div>

                    {comments.data?.commentsCount !== 0 && <Pagination
                        currentPage={page}
                        totalPages={Math.round(comments.data?.commentsCount as number / 5) + 1}
                        onPageChange={(value) => {
                            setPage(value);
                        }}
                    />}

                    <div className="modal-action">
                        <label onClick={onClose} className="btn">Close</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModal;