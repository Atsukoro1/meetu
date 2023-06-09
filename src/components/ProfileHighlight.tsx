import { User } from "@prisma/client";
import { createStyles, Card, Avatar, Text, Group, Button, rem, Box } from '@mantine/core';
import { Image } from "@mantine/core";
import ImageWithFallback from "./ImageWithFallback";

const useStyles = createStyles((theme) => ({
    card: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    },

    avatar: {
        border: `${rem(9)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
}));

interface UserCardImageProps {
    user: ExtendedUser
}

export function UserCardImage({ user }: UserCardImageProps) {
    const { classes } = useStyles();

    return (
        <Card withBorder padding="md" radius="md" className={classes.card}>
            <ImageWithFallback 
                src={user.banner ? user.banner : user.image as string}
                className="rounded-lg overflow-hidden"
                height={"100px"}
                width="100%"       
            />

            <Avatar src={user.image} size={100} radius={80} mx="auto" mt={-30} className={classes.avatar} />

            <Text ta="center" fz="lg" fw={500} mt="sm">
                {user.name}
            </Text>
            <Text ta="center" fz="sm" c="dimmed">
                @{user.slug}
            </Text>

            <Group mt="md" position="center" spacing={30}>
                <div>
                    <Text ta="center" fz="lg" fw={500}>
                        {user.followerCount}
                    </Text>
                    <Text ta="center" fz="sm" c="dimmed">
                        Followers
                    </Text>
                </div>

                <div>
                    <Text ta="center" fz="lg" fw={500}>
                        {user.followingCount}
                    </Text>
                    <Text ta="center" fz="sm" c="dimmed">
                        Following
                    </Text>
                </div>

                <div>
                    <Text ta="center" fz="lg" fw={500}>
                        {user.postCount}
                    </Text>
                    <Text ta="center" fz="sm" c="dimmed">
                        Posts
                    </Text>
                </div>
            </Group>
        </Card>
    );
}

export type ExtendedUser = User & {
    postCount: number;
    followerCount: number;
    followingCount: number;
}

export default UserCardImage;