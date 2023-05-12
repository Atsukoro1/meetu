import Link from 'next/link';
import React from 'react';

type PostContentProps = {
    content: string | null;
};

const PostContent = ({ content }: PostContentProps) => {
    if (!content) {
        return null;
    }

    const parts = content.split(/(@\w+|#\w+)/g);

    return (
        <div className="table w-[375px]">
            {parts.map((part, index) => {
                if (part.startsWith('@')) {
                    return (
                        <Link href={`/profile/${part.replace("@", "")}`} className="tooltip" data-tip="Click me to open user's profile">
                            <span key={index} className="cursor-pointer text-primary">
                                {part}
                            </span>
                        </Link>
                    );
                }

                if (part.startsWith('#')) {
                    return (
                        <div className="tooltip" data-tip="Click me to see the hashtag">
                            <span key={index} className="cursor-pointer text-primary">
                                {part}
                            </span>
                        </div>
                    );
                }

                return part;
            })}
        </div>
    );
}

export default PostContent;
