import { AiOutlineSend } from 'react-icons/ai';
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Skeleton from "@/components/Skeleton";
import { Message } from "@/components/Message";
import { NotificationType, User, Message as MessageType } from "@prisma/client";
import { api } from "@/utils/api";
import { useAtom } from 'jotai';
import { NotificationPoolAtom } from '@/atoms/NotificationPoolAtom';
import Tip from '@/components/Tip';
import { Avatar, Box, Button, Grid, Group, Text, Input, Paper, UnstyledButton, createStyles, Title, Flex, ScrollArea } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { FaPaperPlane } from 'react-icons/fa';

const useStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
        marginBottom: 15
    },

    contentGrid: {
        padding: 20
    },

    messageContainer: {
        flex: 1,
        flexDirection: "column"
    }
}));

const MessageLayout = () => {
    const { data } = useSession();
    const { classes } = useStyles();
    const [page, setPage] = useState<number>(1);
    const [notifications, setNotifications] = useAtom(NotificationPoolAtom);

    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        setCached([]);
        setPage(1);
    }, [selected]);

    const [newMessage, setNewMessage] = useState<string>("");
    const [cached, setCached] = useState<(MessageType & { author: User })[]>([]);

    const createNewMessage = api.conversation.createMessage.useMutation({
        onSuccess: (object) => {
            setCached([...cached, object]);
        }
    });

    const messages = api.conversation.fetchMesssages.useQuery({
        page: page,
        perPage: 10,
        conversationId: selected
    }, {
        onSuccess: (data) => {
            const copied = [...cached];

            data.messages.forEach(el => {
                // @ts-ignore
                if (!copied.some(item => item.id === el.id)) copied.unshift(el);
            });

            setCached(copied);
        }
    });

    const conversations = api.conversation.fetch.useQuery(undefined, {
        onSuccess: (data) => {
            setSelected(data[0]?.id ?? "");
        }
    });

    useEffect(() => {
        notifications.forEach(notification => {
            if (notification.type === NotificationType.MESSAGE) {
                const message = notification.data as MessageType;
                if (message.conversationId === selected) {
                    const copied = [...cached];
                    let index = copied.findIndex(msg => msg.createdAt > message.createdAt);
                    if (index === -1) index = copied.length;
                    // @ts-ignore
                    copied.splice(index, 0, { ...message, author: message.author });
                    setCached(copied);

                    setNotifications(notifications.filter(n => n !== notification));
                }
            }
        });
    }, [notifications, selected, cached, setNotifications]);

    const handleNewMessage = () => {
        if(newMessage === '') return;

        createNewMessage.mutateAsync({
            content: newMessage,
            imageUrl: null,
            conversationId: selected
        });

        setNewMessage("");
    };

    return (
        <div className="w-[45%] pr-3 pl-3 d-flex flex-column justify-content-between">
            <Grid>
                <Grid.Col className={classes.contentGrid} span={4}>
                    <Title mb={5} size="lg">Your conversations</Title>

                    {conversations.data?.map(el => {
                        return (
                            <UnstyledButton onClick={() => setSelected(el.id)} className={classes.user}>
                                <Group>
                                    <Avatar color="cyan" radius="md">MK</Avatar>

                                    <div style={{ flex: 1 }}>
                                        <Text size="sm" weight={500}>
                                            {el.title}
                                        </Text>

                                        <Text color="dimmed" size="xs">
                                            {el.id}
                                        </Text>
                                    </div>

                                    <IconChevronRight size="0.9rem" stroke={1.5} />
                                </Group>
                            </UnstyledButton>
                        )
                    })}
                </Grid.Col>

                <Grid.Col className={classes.contentGrid} span={8}>
                    <ScrollArea h={"60vh"} w={"100%"} className={classes.messageContainer}>
                        {cached.map(el => {
                            return (
                                <Message
                                    data={el}
                                    isAuthor={data?.user.id === el.authorId}
                                />
                            )
                        })}
                    </ScrollArea>

                    <Flex gap={10} mt={20} align="bottom">
                        <Input
                            w={"100%"}
                            placeholder='Your new message...'
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') handleNewMessage();
                            }}
                            onChange={(e) => {
                                setNewMessage(e.target.value);
                            }}
                            value={newMessage}
                        />

                        <Button 
                            rightIcon={<FaPaperPlane/>}
                            onClick={handleNewMessage}
                        >
                            Send
                        </Button>
                    </Flex>
                </Grid.Col>
            </Grid>
        </div>
    );

}

export default MessageLayout;