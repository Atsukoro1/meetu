import { useState } from 'react';
import {
    createStyles,
    Container,
    Avatar,
    UnstyledButton,
    Group,
    Text,
    Menu,
    Tabs,
    Burger,
    rem,
    Flex,
    ActionIcon,
    useMantineColorScheme,
    Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconSun,
    IconMoonStars
} from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { FaTwitter } from 'react-icons/fa';
import SettingsModal from './SettingsModal';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NotificationsMenu from './NotificationsMenu';
import UserMenu from './UserMenu';

const useStyles = createStyles((theme) => ({
    header: {
        paddingTop: theme.spacing.sm,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? 'transparent' : theme.colors.gray[2]
            }`,
        marginBottom: rem(20),
    },

    mainSection: {
        paddingBottom: theme.spacing.sm,
    },

    user: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        transition: 'background-color 100ms ease',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        },

        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('xs')]: {
            display: 'none',
        },
    },

    userActive: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    tabs: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    tabsList: {
        borderBottom: '0 !important',
    },

    tab: {
        fontWeight: 500,
        height: rem(38),
        backgroundColor: 'transparent',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },

        '&[data-active]': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
        },
    },
}));

interface HeaderTabsProps {
    onTabSelect: (tab: Tab) => void;
}

export enum Tab {
    EXPLORE = "Explore",
    MESSAGES = "Messages",
    NOTIFICATIONS = "Notifications"
}

const Navbar = ({ onTabSelect }: HeaderTabsProps) => {
    const { data } = useSession();
    const { classes, theme } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const router = useRouter();

    return (
        <div className={classes.header}>
            <Container className={classes.mainSection}>
                <Group position="apart">
                    <Link style={{ textDecoration: "none", color: theme.colorScheme === 'dark' ? 'white' : "black" }} href="/">
                        <Flex display="flex">
                            <FaTwitter color={theme.colorScheme[1]} size={30} />
                            <Text weight={900} color={theme.colorScheme[0]} ml={4}>Crazy</Text>
                        </Flex>
                    </Link>


                    <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                    <Group spacing={30}>
                        <ActionIcon
                            size="xl"
                            variant="filled"
                            onClick={() => toggleColorScheme()}
                            title="Toggle color scheme"
                        >
                            {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
                        </ActionIcon>

                        <Flex gap={10}>
                            <UserMenu />
                            <NotificationsMenu />
                        </Flex>
                    </Group>
                </Group>
            </Container>

            <Container>
                {router.pathname === '/app' && (
                    <Tabs
                        defaultValue="Home"
                        variant="outline"
                        onTabChange={onTabSelect}
                        classNames={{
                            root: classes.tabs,
                            tabsList: classes.tabsList,
                            tab: classes.tab,
                        }}
                    >
                        <Tabs.List>
                            <Tabs.Tab value={Tab.EXPLORE} key={"Explore"}>
                                Explore
                            </Tabs.Tab>

                            <Tabs.Tab value={Tab.MESSAGES} key={"Messages"}>
                                Messages
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                )}
            </Container>
        </div>
    );
}

export default Navbar;