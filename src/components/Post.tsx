import { BsHandThumbsDownFill, BsHandThumbsDown, BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';

const Post = () => {
    return (
        <div className="bg-neutral p-3 rounded-lg flex flex-row">
            <div className="avatar">
                <div className="w-14 h-14 rounded-xl">
                    <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
            </div>

            <div className="ml-3">
                <div className="flex flex-row gap-1">
                    <h2 className="font-semibold text-md">Name name</h2>
                    <label>@negrneng20</label>
                </div>

                <div>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum pariatur neque reiciendis minima doloribus aperiam suscipit esse laborum hic recusandae dolorem quis, accusantium iste blanditiis sunt nisi. Facilis, rem labore?
                </div>

                <div className="flex flex-row gap-2 mt-2">
                    <BsHandThumbsUpFill size={25}/>        
                    <BsHandThumbsDownFill size={25}/>               
                </div>
            </div>
        </div>
    )
}

export default Post;