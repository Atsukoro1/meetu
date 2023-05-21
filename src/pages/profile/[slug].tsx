import { IconHeart } from '@tabler/icons-react';
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  createStyles,
  rem,
} from '@mantine/core';
import { getServerSession } from 'next-auth';
import { GetServerSidePropsContext } from 'next';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { Social, User } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/utils/api';
import { useSession } from 'next-auth/react';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    width: "400px",
    margin: "auto"
  },

  section: {
    borderBottom: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
      }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));


export function ProfilePage({ user, isFollowing, isConversation }: { user: User & { socials: Social[] }, isFollowing: boolean, isConversation: boolean }) {
  const session = useSession();
  const { classes } = useStyles();

  const [follow, setFollow] = useState(isFollowing);
  const [conversation, setConversation] = useState(isConversation);

  const followUser = api.user.folllowUser.useMutation();
  const unfollowUser = api.user.unfollowUser.useMutation();
  const createConversation = api.conversation.createConversation.useMutation();

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={user.image} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text fz="lg" fw={500}>
            {user.name}
          </Text>
          <Badge size="sm">FEMALE {user.age}</Badge>
        </Group>

        <Text
          dangerouslySetInnerHTML={{ __html: user.bio || "" }}
          fz="sm"
          mt="xs"
        />
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Hobbies
        </Text>

        <Group spacing={7} mt={5}>
          {user.hobbies.map(el => {
            return <Badge key={el}>{el}</Badge>
          })}
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Socials
        </Text>

        <Group spacing={7} mt={5}>
          {user.socials.map(el => {
            return <Link href={el.url}><Badge>{el.text}</Badge></Link>
          })}
        </Group>
      </Card.Section>

      {(session.data?.user.id !== user.id) && (
        <Group mt="xs">
          <Button
            variant={follow ? "outline" : "filled"}
            radius="md"
            loading={followUser.isLoading || unfollowUser.isLoading}
            onClick={async () => {
              if (isFollowing) {
                await unfollowUser.mutateAsync(user.id);
                setFollow(false);
              } else {
                await followUser.mutateAsync(user.id);
                setFollow(true);
              }
            }}
            style={{ flex: 1 }}
          >
            {follow ? "Unfollow" : "Follow"}
          </Button>

          {!conversation && (
            <Button
              variant="filled"
              radius="md"
              loading={createConversation.isLoading}
              onClick={async () => {
                await createConversation.mutateAsync({
                  userIds: [user.id, session.data?.user.id || ""],
                  title: "New conversation"
                });

                setConversation(true);
              }}
              style={{ flex: 1 }}
            >
              Start conversation
            </Button>
          )}
        </Group>
      )}
    </Card>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) return {
    redirect: {
      destination: "/"
    }
  };

  if (!context.query.slug || typeof context.query.slug !== 'string') return {
    redirect: {
      destination: "/404"
    }
  }

  const user = await prisma.user.findFirst({
    where: {
      slug: context.query.slug
    },
    include: {
      socials: true,
      following: true
    }
  });

  if (!user) {
    return {
      redirect: {
        destination: "/"
      }
    };
  }

  const existingRelation = await prisma.userFollows.findUnique({
    where: {
      followerId_followingId: {
        followerId: user.id,
        followingId: session.user.id,
      },
    },
  });

  const existingConversation = await prisma.conversation.findFirst({
    where: {
      userIds: {
        hasEvery: [user.id, session.user.id]
      }
    }
  });

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      isFollowing: !!existingRelation,
      isConversation: !!existingConversation
    }
  }
}

export default ProfilePage;