import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { getServerSession } from "next-auth";
import { useMemo, useState } from "react";
import SocialBadge from "@/components/SocialBadge";
import ProfileCard from "@/components/ProfileCard";
import Skeleton from "@/components/Skeleton";
import { Social } from "@prisma/client";

const AboutTab = ({ user }: Omit<InferGetServerSidePropsType<typeof getServerSideProps>, 'isFollowing'>) => {
    return (
        <div>
            <label>Hobbies</label>
            <div className="mt-1.5 mb-3 flex flex-wrap max-w-[400px] gap-2">
                {user.hobbies && user.hobbies.map((el: String) => {
                    return (
                        <div
                            key={Math.random().toString()}
                            className="badge badge-primary gap-2"
                        >
                            {el}
                        </div>
                    )
                })}
            </div>

            <label>Socials</label>
            <div className="mt-1.5 mb-3 flex flex-wrap max-w-[400px] gap-2">
                {user.socials && user.socials.map((el: Social) => {
                    return (
                        <SocialBadge key={el.id} social={el} />
                    )
                })}
            </div>
        </div>
    )
};

const PostsTab = ({ user }: Omit<InferGetServerSidePropsType<typeof getServerSideProps>, 'isFollowing'>) => {
    return (
        <div>

        </div>
    )
};

const FollowingTab = ({ user }: Omit<InferGetServerSidePropsType<typeof getServerSideProps>, 'isFollowing'>) => {
    const followings = api.user.getFollowing.useQuery({
        userId: user.id
    });

    return (
        <div className="gap-3">
            {followings.isLoading ? (
                <Skeleton
                    width={"100%"}
                    height="100px"
                />
            ) : (
                followings.data.following.map((el: any) => {
                    return (
                        <ProfileCard user={el.following}/>
                    )
                })
            )}
        </div>
    )
};

const Profile = ({ user, isFollowing }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [following, setFollowing] = useState<boolean>(isFollowing);
    const [activeTab, setActiveTab] = useState<number>(1);

    const followUser = api.user.folllowUser.useMutation({
        onSuccess: () => {
            setFollowing(true);
        }
    });
    const unfollowUser = api.user.unfollowUser.useMutation({
        onSuccess: () => {
            setFollowing(false);
        }
    })

    const Tab = useMemo(() => {
        switch (activeTab) {
            case 1: return <AboutTab user={user} />;
            case 2: return <PostsTab user={user} />
            case 3: return <FollowingTab user={user} />
        }
    }, [activeTab]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="card-normal bg-neutral h-fit overflow-hidden">
                <div>
                    <img
                        src={user.banner as string}
                        className="rounded-xl h-[195px] w-[550px] object-cover"
                    />

                    <button
                        className={`btn relative top-[-60px] ${following ? "left-[420px]" : "left-[450px]"}`}
                        onClick={() => {
                            if (following) {
                                unfollowUser.mutateAsync(user.id);
                            } else {
                                followUser.mutateAsync(user.id);
                            }
                        }}
                    >
                        {following ? "Following" : "Follow"}
                    </button>
                </div>

                <div className="p-5">
                    <div className="flex flex-row mt-[-50px]">
                        <div className="avatar online mt-[-70px]">
                            <div className="w-24 rounded-xl">
                                <img src={user.image as string} />
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <h2 className="text-2xl font-bold mt-[-15px] ml-4">{user.name}</h2>
                            <div className="badge badge-outline badge-primary mt-[-5px] ml-2">{user.age}y.o {user.gender}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-lg font-semibold">Bio</label>
                        <div className="table w-fit max-w-[500px] bg-base-100 p-2 rounded-lg">{user.bio}</div>
                    </div>

                    <div className="tabs tabs-boxed mt-5">
                        <a
                            onClick={() => setActiveTab(1)}
                            className={`tab w-1/3 ${activeTab === 1 && 'tab-active'}`}
                        >
                            About info
                        </a>
                        <a
                            onClick={() => setActiveTab(2)}
                            className={`tab w-1/3 ${activeTab === 2 && 'tab-active'}`}
                        >
                            Posts
                        </a>
                        <a
                            onClick={() => setActiveTab(3)}
                            className={`tab w-1/3 ${activeTab === 3 && 'tab-active'}`}
                        >
                            Following
                        </a>
                    </div>

                    <div className="mt-2">{Tab}</div>
                </div>
            </div>
        </div>
    )
}

export default Profile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if(!session) return {
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
