import slugify from "@/utils/slugify";
import { User } from "@prisma/client";

export type ExtendedUser = User & {
    postCount: number;
    followerCount: number;
    followingCount: number;
}

const ProfileHighlight = ({ user }: { user: ExtendedUser }) => {
    return (
        <div className="w-full rounded-xl bg-neutral p-3 mt-4">
            <img
                src={user.image || ""}
                className="w-full h-[130px] object-cover rounded-lg"
                alt="banner"
            />

            <img
                src={user.image || ""}
                className="w-[90px] h-[90px] mt-[-65px] mx-auto  object-cover rounded-lg"
                alt="banner"
            />

            <div className="w-fit mx-auto">
                <h2 className="text-center text-lg font-bold mt-3">{user.name}</h2>
                
                <label className="text-center text-md text-slate-400">
                    @{slugify(user.name || "")}
                </label>
            </div>

            <div className="w-fit mx-auto flex flex-row gap-4 mt-3">
                <div className="text-center bg-base-100 p-2 rounded-lg">
                    <p className="text-primary">Posts</p>
                    <p>{user.postCount}</p>
                </div>

                <div className="text-center bg-base-100 p-2 rounded-lg">
                    <p className="text-primary">Following</p>
                    <p>{user.followingCount}</p>
                </div>

                <div className="text-center bg-base-100 p-2 rounded-lg">
                    <p className="text-primary">Followers</p>
                    <p>{user.followerCount}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileHighlight;