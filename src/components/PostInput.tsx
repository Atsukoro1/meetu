const PostInput = () => {
    return (
        <div className="flex w-fit mx-auto flex-row gap-4">
            <div className="avatar">
                <div className="w-12 h-12 rounded-xl">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>

            <input
                type="text"
                placeholder="New post content..."
                className="input input-bordered input-primary w-full"
            />

            <button className="btn btn-primary">Publish</button>
        </div>
    )
};

export default PostInput;