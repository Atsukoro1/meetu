import slugify from "@/utils/slugify";
import { useSession } from "next-auth/react";

const ProfileHighlight = () => {
    const { data } = useSession();

    return (
        <div className="w-full rounded-xl bg-neutral p-3 mt-4">
            <img
                src={data?.user.image || ""}
                className="w-full h-[130px] object-cover rounded-lg"
                alt="banner"
            />

            <img
                src={data?.user.image || ""}
                className="w-[90px] h-[90px] mt-[-65px] mx-auto  object-cover rounded-lg"
                alt="banner"
            />

            <div className="w-fit mx-auto">
                <h2 className="text-center text-lg font-bold mt-3">{data?.user.name}</h2>
                <label className="text-center text-md text-slate-400">@{slugify(data?.user.name || "")}</label>
            </div>

            <div className="w-fit mx-auto flex flex-row gap-4 mt-3">
                <div className="text-center bg-base-100 p-2 rounded-lg">
                    <p className="text-primary">Posts</p>
                    <p>2</p>
                </div>

                <div className="text-center bg-base-100 p-2 rounded-lg">
                    <p className="text-primary">Following</p>
                    <p>23</p>
                </div>

                <div className="text-center bg-base-100 p-2 rounded-lg">
                    <p className="text-primary">Following</p>
                    <p>23</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileHighlight;