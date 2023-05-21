import { Notification } from "@prisma/client";
import { Avatar, Box, Flex, Paper, Text } from "@mantine/core";

const Notification = ({ data }: { data: Notification }) => {
    return (
        <Paper w={300} variant="outline" withBorder p={14} className="flex flex-row bg-neutral p-3 rounded-lg">
            <Flex gap={15}>
                <Avatar
                    alt={`pfp_${data.id}`} 
                    src={data.image || ""} 
                />

                <Flex direction="row" wrap="wrap">
                    <Text weight="bold">{data.title}</Text>
                    <Text size="sm" color="dimmed">{data.content}</Text>
                </Flex>
            </Flex>
        </Paper>
    )
}

export default Notification;