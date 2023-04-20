import { useState, useEffect } from "react";
import { env } from "@/env.mjs";
import { Attachment } from "@prisma/client";
import Skeleton from "./Skeleton";

const AttachmentComponent = ({ data }: { data: Attachment | null }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) {
            setLoading(true);
        }
    }, [data]);

    const handleImageLoad = () => {
        setLoading(false);
    };

    if (data) {
        return (
            <div>
                <input type="checkbox" id={`attachment_${data.id}`} className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        {loading && <Skeleton width="500px" height="500px" />}
                        <img
                            src={`${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/attachment/${data?.id}`}
                            width={500}
                            height={500}
                            alt="Attachment of the post"
                            onLoad={handleImageLoad}
                            style={{ display: loading ? 'none' : 'block' }}
                        />

                        <div className="modal-action">
                            <label htmlFor={`attachment_${data.id}`} className="btn">Close</label>
                        </div>
                    </div>
                </div>

                <label htmlFor={`attachment_${data.id}`}>
                    {loading && <Skeleton width="200px" height="200px" />}
                    <img
                        className="mt-4 mb-4 hover:cursor-pointer hover:opacity-70"
                        src={`${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/attachment/${data?.id}`}
                        width={200}
                        height={200}
                        alt="Attachment of the post"
                        onLoad={handleImageLoad}
                        style={{ display: loading ? 'none' : 'block' }}
                    />
                </label>
            </div>
        )
    } else {
        return <></>
    }
}

export default AttachmentComponent;
