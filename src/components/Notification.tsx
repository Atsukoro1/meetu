import { Notification } from "@prisma/client";
import { RxDotFilled } from 'react-icons/rx';
import moment from "moment";
import Image from "next/image";

const Notification = ({ data }: { data: Notification }) => {
    return (
        <div className="flex flex-row bg-neutral p-3 rounded-lg">
            <div className="avatar">
                <div className="w-14 h-14 rounded-full">
                    <Image width={20} height={20} className="h-[20px] w-[20px]" alt={`pfp_${data.id}`} src={data.image || ""} />
                </div>
            </div>

            <div className="ml-4 align-middle mt-3">
                <div className="flex flex-row m-auto">
                    <h2>{data.title}</h2>
                    <RxDotFilled className="text-slate-700" size={25}/>
                    <label className="text-slate-500">{moment(data.createdAt).fromNow()}</label>
                </div>

                <label>{data.content}</label>
            </div>
        </div>
    )
}

export default Notification;