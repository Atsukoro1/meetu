import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    createStyles,
    Flex,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { User } from '@prisma/client';

const useProfileCardStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
    },
}));

const useProfileHighlightStyles = createStyles((theme) => ({
    user: {
        display: 'block',
        width: '100%',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
    },

    nameContainer: {
        marginLeft: 15,
        lineHeight: 1
    }
}));

interface UserButtonProps extends UnstyledButtonProps {
    user: User
}

export function ProfileCard({ user, ...others }: UserButtonProps) {
    const { classes } = useProfileCardStyles();

    return (
        <UnstyledButton className={classes.user} {...others}>
            <Group>
                <Avatar src={user.image} radius="xl" />

                <div style={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                        {user.name}
                    </Text>

                    <Text color="dimmed" size="xs">
                        {user.email}
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    );
}

export function ProfileHighlightCard({ user, ...others }: UserButtonProps) {
    const { classes } = useProfileHighlightStyles();

    return (
        <UnstyledButton className={classes.user} {...others}>
            <Group>
                <Flex>
                    <Avatar src={user.image} radius="xl" />

                    <div className={classes.nameContainer}>
                        <Text size="sm" weight={500}>
                            {user.name}
                        </Text>

                        <Text color="dimmed" size="xs">
                            @{user.slug}
                        </Text>
                    </div>
                </Flex>
            </Group>

            <Group mt="md" position="center" spacing={30}>
                <div>
                    <Text ta="center" fz="lg" fw={500}>
                        50
                    </Text>
                    <Text ta="center" fz="sm" c="dimmed">
                        Followers
                    </Text>
                </div>

                <div>
                    <Text ta="center" fz="lg" fw={500}>
                        20
                    </Text>
                    <Text ta="center" fz="sm" c="dimmed">
                        Following
                    </Text>
                </div>
            </Group>
        </UnstyledButton>
    );
}
