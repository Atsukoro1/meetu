import { FaHashtag, FaBell } from "react-icons/fa";
import { HiOutlineMail } from 'react-icons/hi';
import { IconType } from "react-icons";

type ItemType = {
    name: string;
    icon: IconType;
    badge?: string;
};

const items: ItemType[] = [
    {
        name: "Explore",
        icon: FaHashtag
    },
    {
        name: "Messages",
        icon: HiOutlineMail
    }
]

const MenuItem = (props: { item: ItemType }) => {
    return (
        <div className="bg-neutral p-4 rounded-lg flex flex-row gap-3 mt-2.5 hover:cursor-pointer hover:bg-base-100">
            <props.item.icon color="white" size={25} />
            <h3 className="font-semibold">{props.item.name}</h3>
        </div>
    )
}

const Menu = ({ unreadCount }: { unreadCount?: number }) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="mt-3">
                {items.map(el => {
                    return <MenuItem key={el.name} item={el} />
                })}
            </div>

            <div className="bg-neutral p-4 rounded-lg flex flex-row gap-3 hover:cursor-pointer hover:bg-base-100">
                <div className="indicator">
                    <span className="indicator-item badge bg-primary badge-primary">{unreadCount}</span>
                    <div className="grid place-items-center"><FaBell color="white" size={25} /></div>
                </div>

                <h3 className="font-semibold indicator">
                    Notifications
                </h3>
            </div>

            <button className="btn btn-primary w-full mt-3">
                Create a post
            </button>
        </div>
    )
}

export default Menu;