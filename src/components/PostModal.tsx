import { ExtendedPost } from "./Post";

const PostModalBlockAuthor = ({ post }: { post: ExtendedPost }) => {
    return (
        <div>
            <div className="flex flex-row">
                <div className="avatar">
                    <div className="w-[80px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={post.author.image as string}/>
                    </div>
                </div>

                <div className="ml-5">
                    <h1 className="text-xl font-bold">{post.author.name}</h1>
                    <p className="table w-[200px]">{post.content}</p>
                </div>
            </div>
        </div>
    )
}

const PostModalBlockComment = () => {
    <div>

    </div>
}

const PostModal = ({ post }: { post: ExtendedPost }) => {
    return (
        <div>
            <input type="checkbox" id="my-modal" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box">
                    <PostModalBlockAuthor post={post} />

                    <div className="modal-action">
                        <label htmlFor="my-modal" className="btn">Close</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModal;