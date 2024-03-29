import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { getServerSession } from "next-auth";
import PostLayout from "@/layouts/PostLayout";
import MessageLayout from "@/layouts/MessageLayout";
import { Tab } from "@/components/Navbar";
import { api } from "@/utils/api";

const AppPage = ({
    page,
    recentUsers,
    userWithoutSensitiveData
}: InferGetServerSidePropsType<typeof getServerSideProps> & { page: Tab }) => {
    api.post.listMetarankInteractions.useQuery();
    switch(page) {
        case Tab.EXPLORE: 
            return <PostLayout recentUsers={recentUsers} userWithoutSensitiveData={userWithoutSensitiveData} />;

        case Tab.MESSAGES:
            return <MessageLayout />;
    }
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