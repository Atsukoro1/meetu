import {
    UnstyledButton,
    UnstyledButtonProps,
    Group,
    Avatar,
    Text,
    createStyles,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { User } from '@prisma/client';

const useStyles = createStyles((theme) => ({
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

interface UserButtonProps extends UnstyledButtonProps {
    user: User
}

export function ProfileCard({ user, ...others }: UserButtonProps) {
    const { classes } = useStyles();

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

                <IconChevronRight size="0.9rem" stroke={1.5} />
            </Group>
        </UnstyledButton>
    );
}