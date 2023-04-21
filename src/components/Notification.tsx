import { Notification } from "@prisma/client";
import moment from "moment";

const Notification = ({ data }: { data: Notification }) => {
    return (
        <div className="flex flex-row">
            <div className="avatar">
                <div className="w-24 rounded-full">
                    <img className="h-[50px] w-[50px]" src={data.image || ""} />
                </div>
            </div>

            <div>
                <div className="flex flex-row">
                    <h2>{data.title}</h2>
                    <label>{moment(data.createdAt).fromNow()}</label>
                </div>

                <div>
                    {data.content}
                </div>
            </div>
        </div>
    )
}

export default Notification;