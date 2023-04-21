import { Notification } from "@prisma/client";
import { RxDotFilled } from 'react-icons/rx';
import moment from "moment";

const Notification = ({ data }: { data: Notification }) => {
    return (
        <div className="flex flex-row bg-neutral p-3 rounded-lg">
            <div className="avatar">
                <div className="w-20 rounded-full">
                    <img className="h-[30px] w-[30px]" src={data.image || ""} />
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