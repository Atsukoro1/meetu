import { User } from "@prisma/client";
import Link from "next/link";

type ProfileSearchResultPropsI = {
    onClick: () => void;
    user: User;
}

type ProfileCardPropsI = {
    user: User;
};

export const ProfileSearchResult = ({ user, onClick }: ProfileSearchResultPropsI) => {
    return (
        <div
            onClick={onClick}
            style={{
                backgroundImage: `url(${user.banner}`,
                backgroundAttachment: "fixed"
            }}
            className={`bg-cover w-[50%] bg-opacity-30 flex flex-row bg-base-100 rounded-xl hover:bg-neutral transition-all ease-in-out hover:cursor-pointer`}
        >
            <div className="flex flex-row bg-gradient-to-r from-40% from-neutral/[.90] via-neutral/[.70] to-transparent w-full bg-opacity-50 p-1">
                <div className="mr-4">
                    <div className="avatar">
                        <div className="w-7 rounded-xl">
                            <img src={user.image as string} />
                        </div>
                    </div>
                </div>

                <h3 className="font-semibold">{user.name}</h3>
            </div>
        </div>
    )
};

export const ProfileCard = ({ user }: ProfileCardPropsI) => {
    return (
        <Link
            style={{
                backgroundImage: `url(${user.banner}`,
                backgroundAttachment: "fixed"
            }}
            href={`/profile/${user.slug}`}
            className={`bg-cover overflow-hidden bg-opacity-30 flex flex-row bg-base-100 rounded-xl hover:bg-neutral transition-all ease-in-out hover:cursor-pointer`}
        >
            <div className="flex flex-row bg-gradient-to-r from-40% from-neutral/[.90] via-neutral/[.70] to-transparent w-full bg-opacity-50 p-3">
                <div className="mr-4">
                    <div className="avatar">
                        <div className="w-14 rounded-xl">
                            <img src={user.image as string} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <label className="text-sm">{user.bio?.substring(0, 70)}...</label>
                </div>
            </div>
        </Link>
    )
}