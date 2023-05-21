import { createStyles, Text, Avatar, Group, rem, Flex, Center } from '@mantine/core';
import { Message, User } from '@prisma/client';
import moment from 'moment';

const useStyles = createStyles((theme) => ({
    body: {
        paddingLeft: rem(5),
        background: theme.colorScheme[0],
        borderRadius: "20px",
        height: "fit",
        width: "fit"
    },

    authorBox: {
        float: "right",
        clear: "both",
        alignSelf: "end",
        paddingBottom: 20,
    padding: 10
},

    createdDate: {
        paddingLeft: rem(5)
    },

    recipientBox: {
        float: "left",
        clear: "both",
        paddingBottom: 20,
        padding: 10
    },

    content: {
        marginLeft: "10px"
    }
}));

export function Message({ data, isAuthor }: { data: Message & { author: User }, isAuthor: boolean }) {
    const { classes } = useStyles();

    return (
        <Flex className={isAuthor ? classes.authorBox : classes.recipientBox}>
            <div>
                <Avatar
                    src={data.author.image}
                    alt={data.author.name || ""}
                    radius="md"
                />
            </div>

            <div className={classes.content}>
                <Text className={classes.body} size="sm">
                    {data.content}
                </Text>

                <Text className={classes.createdDate} size="xs" color="dimmed">
                    {moment(data.createdAt).fromNow()}
                </Text>
            </div>
        </Flex>
    );
}

export default Message;