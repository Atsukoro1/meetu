import { FilePond } from 'react-filepond';
import { uploadFile } from '@/utils/supabase';
import { api } from '@/utils/api';
import { registerPlugin } from 'react-filepond';
import FilePondImagePreviewPlugin from 'filepond-plugin-image-preview';
import { useState } from 'react';
import { Attachment } from '@prisma/client';

const AttachmentPanel = ({ onAttachment }: { onAttachment: (attachment: Attachment) => void; }) => {
    const createAttachment = api.post.createPostAttachment.useMutation();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    registerPlugin(FilePondImagePreviewPlugin);

    return (
        <div className="flex flex-row gap-2">
            <div className={`modal ${modalOpen ? "modal-open" : ""}`}>
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
                                onAttachment(result);
                                setModalOpen(false);
                            };
                        }}
                        labelIdle='Drag & Drop your profile picture <span class="filepond--label-action">or click here</span>'
                    />
                </div>
            </div>
        </div>
    )
}

export default AttachmentPanel;