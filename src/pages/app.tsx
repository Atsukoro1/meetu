import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ProfileHighlight, { ExtendedUser } from "@/components/ProfileHighlight";
import { ProfileCard } from "@/components/ProfileCard";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import PostLayout from "@/layouts/PostLayout";
import NotificationLayout from "@/layouts/NotificationLayout";
import MessageLayout from "@/layouts/MessageLayout";
import { Tab } from "@/components/Navbar";
import Tip from "@/components/Tip";
import { Divider, Group, Title } from "@mantine/core";
import { FaRetweet } from "react-icons/fa";

const AppPage = ({
    page,
    recentUsers,
    userWithoutSensitiveData
}: InferGetServerSidePropsType<typeof getServerSideProps> & { page: Tab }) => {
    return (
        <div className="flex h-[93vh]">
            <div className="w-[30%] ml-3">
                <ProfileHighlight user={userWithoutSensitiveData as ExtendedUser} />

                <Group className="w-fit mx-auto mt-3">
                    <Tip actionText="to create a new post" keys={["ctrl", "+", "p"]}/>
                </Group>
            </div>
            
            {page === Tab.EXPLORE && <PostLayout/>}
            {page === Tab.NOTIFICATIONS && <NotificationLayout/>}
            {page === Tab.MESSAGES && <MessageLayout/>}

            <div className="block w-[25%]">
            <div className="p-3">
                <div className="flex flex-row gap-2">
                    <Title size="20">Who to follow</Title>
                    <Divider size="sm" orientation="vertical" />
                    <FaRetweet className="mt-1.5" color="white"/>
                </div>

                <div className="flex flex-col gap-4">
                    {recentUsers.map((el: User) => {
                        return (
                            <ProfileCard key={el.id} user={el} />
                        )
                    })}
                </div>
            </div>
            </div>
        </div>
    )
}

export default AppPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) return {
        redirect: {
            destination: "/"
        }
    };

    const recentUsers = await prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
    });

    const userWithCounts = await prisma.user.findFirst({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            email: true,
            emailVerified: true,
            gender: true,
            setupDone: true,
            hobbies: true,
            age: true,
            image: true,
            bio: true,
            socials: true,
            accounts: true,
            sessions: true,
            authoredPosts: { select: { id: true } },
            following: { select: { followingId: true } },
            followers: { select: { followerId: true } },
        },
    }) as any;

    userWithCounts.postCount = userWithCounts.authoredPosts.length;
    userWithCounts.followerCount = userWithCounts.followers.length;
    userWithCounts.followingCount = userWithCounts.following.length;

    const { following, followers, ...userWithoutSensitiveData } = userWithCounts;

    return {
        props: {
            recentUsers: JSON.parse(JSON.stringify(recentUsers)),
            userWithoutSensitiveData: JSON.parse(JSON.stringify(userWithoutSensitiveData)),
            revalidate: 20
        }
    };
}