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
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { authOptions } from '@/server/auth';
import { prisma } from '@/server/db';
import { Social, User } from '@prisma/client';
import DOMPurify from 'dompurify';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    width: "400px",
    margin: "auto"
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
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


export function ProfilePage({ user }: { user: User & { socials: Social[] } }) {
  const { classes } = useStyles();

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
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user.bio || "") }} 
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

      <Group mt="xs">
        <Button variant='filled' radius="md" style={{ flex: 1 }}>
          Follow
        </Button>
        
        <Button variant="filled" radius="md" style={{ flex: 1 }}>
          Start conversation
        </Button>
      </Group>
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

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            isFollowing: !!existingRelation
        }
    }
}

export default ProfilePage;