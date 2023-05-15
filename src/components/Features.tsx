import {
    createStyles,
    Badge,
    Group,
    Title,
    Text,
    Card,
    SimpleGrid,
    Container,
    rem,
} from '@mantine/core';
import { IconGauge, IconUser, IconCookie } from '@tabler/icons-react';

const mockdata = [
    {
        title: 'User-Centric Design',
        description:
            'Our platform offers an intuitive and seamless user experience. Its designed to make you feel at home while providing powerful features to enhance your social media journey.',
        icon: IconGauge,
    },
    {
        title: 'Privacy First Approach',
        description:
            'We put your privacy first. We have stringent data policies that ensure your personal information is secure. You have total control over your data and who can see it.',
        icon: IconUser,
    },
    {
        title: 'Ad-Free Experience',
        description:
            'Our platform is completely ad-free. Enjoy your social interactions without any interruptions or distractions. Your timeline, your rules.',
        icon: IconCookie,
    },
];


const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(34),
        fontWeight: 900,

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(24),
        },
    },

    description: {
        maxWidth: 600,
        margin: 'auto',

        '&::after': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: rem(45),
            height: rem(2),
            marginTop: theme.spacing.sm,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },

    card: {
        border: `${rem(1)} solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
            }`,
    },

    cardTitle: {
        '&::after': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: rem(45),
            height: rem(2),
            marginTop: theme.spacing.sm,
        },
    },
}));

const FeaturesCards = () => {
    const { classes, theme } = useStyles();
    const features = mockdata.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
            <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
            <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
                {feature.title}
            </Text>
            <Text fz="sm" c="dimmed" mt="sm">
                {feature.description}
            </Text>
        </Card>
    ));

    return (
        <Container size="lg" py="xl">
            <Group position="center">
                <Badge variant="filled" size="lg">
                    Why us over Twitter
                </Badge>
            </Group>

            <Title order={2} className={classes.title} ta="center" mt="sm">
                We're different
            </Title>

            <Text c="dimmed" className={classes.description} ta="center" mt="md">
                Break free from the regular social media constraints. Experience a platform that prioritizes you, respects your privacy, and offers an ad-free environment. Welcome to the future of social networking.
            </Text>

            <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                {features}
            </SimpleGrid>
        </Container>
    );
}

export default FeaturesCards;