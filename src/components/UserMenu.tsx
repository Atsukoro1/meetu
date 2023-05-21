import { Avatar, Menu, Modal } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import SettingsModal from "./SettingsModal";
import { useDisclosure } from "@mantine/hooks";
import { FaRegFileArchive } from "react-icons/fa";

const UserMenu = () => {
    const [opened, { open, close }] = useDisclosure();
    const { data } = useSession();

    return (
        <>
            <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                withinPortal
            >
                <Menu.Target>
                    <Avatar sx={{ cursor: 'pointer' }} w={45} h={45} src={data?.user.image} alt={data?.user.name || ""} radius="xl" size={20} />
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Settings</Menu.Label>
                    <Menu.Item onClick={open} icon={<IconSettings size="0.9rem" stroke={1.5} />}>
                        Account settings
                    </Menu.Item>
                    <Menu.Item
                        onClick={() => signOut()}
                        icon={<FaRegFileArchive size="0.9rem" stroke={"1.5px"} />
                        }>
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <Modal title="Settings" opened={opened} onClose={close}>
                <SettingsModal onClose={close} />
            </Modal>
        </>
    )
}

export default UserMenu;