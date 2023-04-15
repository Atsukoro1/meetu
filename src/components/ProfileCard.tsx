import { User } from "@prisma/client";
import Link from "next/link";

const ProfileCard = ({ user }: { user: User }) => {
    return (
        <Link 
            style={{
                backgroundImage: `url(${user.banner}`,
                backgroundAttachment: "fixed"
            }}
            href={`/profile/${user.slug}`} 
            className={`bg-cover bg-opacity-30 flex flex-row bg-base-100 rounded-xl hover:bg-neutral transition-all ease-in-out hover:cursor-pointer`}
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
                <label className="text-sm">{user.bio?.substring(1, 40)}...</label>
            </div>
            </div>
        </Link>
    )
}

export default ProfileCard;