import { Text, Title, createStyles } from "@mantine/core";
import Link from "next/link";
import React from "react";

type PostContentProps = {
  content: string | null;
};

const useStyles = createStyles((theme) => ({
  link: {
    color: theme.colors.blue,
  },
}));

const PostContent = ({ content }: PostContentProps) => {
  const { classes } = useStyles();

  if (!content) {
    return null;
  }

  const parts = content.split(/(@\w+|#\w+)/g);

  return (
    <Text size="sm" className="table w-[375px]">
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          return (
            <Link
              className={classes.link}
              href={`/profile/${part.replace("@", "")}`}
            >
              {part}
            </Link>
          );
        }

        if (part.startsWith("#")) {
          return (
            <Link
              className={classes.link}
              href={`/tag/${part.replace("#", "")}`}
              key={index}
            >
              {part}
            </Link>
          );
        }

        return part;
      })}
    </Text>
  );
};

export default PostContent;
