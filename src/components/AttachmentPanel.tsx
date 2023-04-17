import { CgSmileMouthOpen } from 'react-icons/cg';
import { AiFillPicture } from 'react-icons/ai';
import { FilePond } from 'react-filepond';
import { uploadFile } from '@/utils/supabase';
import { api } from '@/utils/api';
import { env } from '@/env.mjs';

const AttachmentPanel = ({ onAttachment }: { onAttachment: (url: string) => void; }) => {
    const createAttachment = api.post.createPostAttachment.useMutation();

    return (
        <div className="flex flex-row gap-2">
            <button className="btn btn-square rounded-xl bg-base-100 hover:neutral">
                <CgSmileMouthOpen size={25} />
            </button>

            <a href="#attachmentmodal">
                <button className="btn btn-square rounded-xl bg-base-100 hover:neutral">
                    <AiFillPicture size={25} />
                </button>
            </a>

            <div className="modal" id="attachmentmodal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Upload the image/video!</h3>

                    <FilePond
                        allowMultiple={false}
                        maxFiles={1}
                        name="files"
                        onaddfile={async (error, file) => {
                            if (error) return;

                            const result = await createAttachment.mutateAsync({
                                type: file.fileType
                            });

                            if (await uploadFile(
                                `attachment/${result.id}`,
                                new File([file.file], file.file.name, {
                                    type: file.file.type,
                                }),
                                "test"
                            )) {
                                onAttachment(result.id);
                            };
                        }}
                        labelIdle='Drag & Drop your profile picture <span class="filepond--label-action">or click here</span>'
                    />

                    <div className="modal-action mt-7">
                        <a href="#" className="btn">Close</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AttachmentPanel;