import { env } from "@/env.mjs";
import { Attachment } from "@prisma/client"
import Image from "next/image";

const Attachment = ({ data }: { data: Attachment | null }) => {
    if (data) {
        return (
            <div>
                <input type="checkbox" id={`attachment_${data.id}`} className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box">
                        <Image
                            src={`${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/attachment/${data?.id}`}
                            width={500}
                            height={500}
                            alt="Attachment of the post"
                        />

                        <div className="modal-action">
                            <label htmlFor={`attachment_${data.id}`} className="btn">Close</label>
                        </div>
                    </div>
                </div>

                <label htmlFor={`attachment_${data.id}`}>
                    <Image
                        className="mt-4 mb-4 hover:cursor-pointer hover:opacity-70"
                        src={`${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/attachment/${data?.id}`}
                        width={200}
                        height={200}
                        alt="Attachment of the post"
                    />
                </label>
            </div>
        )
    } else {
        return <></>
    }
}

export default Attachment;