import { api } from "@/utils/api";
import { ActionIcon, Button, Flex, Menu, Text } from "@mantine/core";
import { useState } from "react";
import { FaBell } from "react-icons/fa";
import Notification from "./Notification";

const NotificationsMenu = () => {
    const [opened, setOpened] = useState(false);
    const notifications = api.notification.fetchNotifications.useQuery({
        page: 1,
        perPage: 6
    });

    return (
        <Menu opened={opened} onChange={setOpened} shadow="md">
            <Menu.Target>
                <ActionIcon size="xl">
                    <FaBell size={25} color="gray" />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Flex direction="column" wrap="wrap" gap={8}>
                    {notifications.data?.notifications.length === 0 ? (
                        <Text p={10}>
                            No notifications to read
                        </Text>
                    ) : (
                        notifications.data?.notifications.map(el => {
                            return (
                                <Notification key={el.id} data={el} />
                            )
                        })
                    )}
                </Flex>
            </Menu.Dropdown>
        </Menu>
    )
}

export default NotificationsMenu;