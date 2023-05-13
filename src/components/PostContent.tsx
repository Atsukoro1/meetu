import { Text, Title, createStyles } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

type PostContentProps = {
    content: string | null;
};

const useStyles = createStyles((theme) => ({
    link: {
        color: theme.colors.blue
    }
}));

const PostContent = ({ content }: PostContentProps) => {
    const { classes } = useStyles();

    if (!content) {
        return null;
    }

    const parts = content.split(/(@\w+|#\w+)/g);

    return (
        <Title order={3} size="sm" weight={"600"} className="table w-[375px]">
            {parts.map((part, index) => {
                if (part.startsWith('@')) {
                    return (
                        <Link 
                            className={classes.link} 
                            href={`/profile/${part.replace("@", "")}`}
                        >
                            {part}
                        </Link>
                    );
                }

                if (part.startsWith('#')) {
                    return (
                        <Text key={index} className="text-secondary cursor-default">
                            {part}
                        </Text>
                    );
                }

                return part;
            })}
        </Title>
    );
}

export default PostContent;
