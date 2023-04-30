import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ProfileHighlight, { ExtendedUser } from "@/components/ProfileHighlight";
import ProfileCard from "@/components/ProfileCard";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import Menu, { OnClickMenuAction } from "@/components/Menu";
import PostLayout from "@/layouts/PostLayout";
import { useState } from "react";
import NotificationLayout from "@/layouts/NotificationLayout";
import MessageLayout from "@/layouts/MessageLayout";


const AppPage = ({
    recentUsers,
    userWithoutSensitiveData
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [page, setPage] = useState<OnClickMenuAction>(OnClickMenuAction.EXPLORE);
    const notifications = api.notification.unreadNotificationCount.useQuery();

    return (
        <div className="flex h-[93vh]">
            <div className="w-[30%] ml-3">
                <ProfileHighlight user={userWithoutSensitiveData as ExtendedUser} />
                <Menu 
                    unreadCount={notifications.data} 
                    onChange={(value) => setPage(value)}
                />
            </div>
            
            {page === OnClickMenuAction.EXPLORE && <PostLayout/>}
            {page === OnClickMenuAction.NOTIFICATIONS && <NotificationLayout/>}
            {page === OnClickMenuAction.MESSAGES && <MessageLayout/>}

            <div className="p-3 w-[25%]">
                <h2 className="font-bold text-xl mb-2">Explore new profiles</h2>
                <div className="flex flex-col gap-4">
                    {recentUsers.map((el: User) => {
                        return (
                            <ProfileCard key={el.id} user={el} />
                        )
                    })}
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
        take: 10,
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