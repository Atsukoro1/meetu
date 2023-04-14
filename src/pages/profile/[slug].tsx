import { useMemo, useState } from "react";

const AboutTab = () => {
    return (
        <div>
            About
        </div>
    )
};

const PostsTab = () => {
    return (
        <div>
            Posts
        </div>
    )
};

const FollowingTab = () => {
    return (
        <div>
            Following
        </div>
    )
};

const Profile = () => {
    const [activeTab, setActiveTab] = useState<number>(1);

    const Tab = useMemo(() => {
        switch(activeTab) {
            case 1: return <AboutTab/>;
            case 2: return <PostsTab/>
            case 3: return <FollowingTab/>
        }
    }, [activeTab]);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="card-normal bg-neutral h-fit overflow-hidden">
                <div>
                    <img
                        src="https://c4.wallpaperflare.com/wallpaper/923/689/83/japan-sakura-pink-beautiful-wallpaper-preview.jpg"
                        className="rounded-xl h-[195px] w-[550px] object-cover"
                    />

                    <button className="btn relative top-[-60px] left-[450px]">
                        Follow
                    </button>
                </div>

                <div className="p-5">
                    <div className="flex flex-row mt-[-50px]">
                        <div className="avatar online mt-[-70px]">
                            <div className="w-24 rounded-xl">
                                <img src="https://cdn.discordapp.com/avatars/937757295453044806/1eaa758caacdc9a7f92bb49617d91be0.webp" />
                            </div>
                        </div>

                        <div className="flex flex-row">
                            <h2 className="text-2xl font-bold mt-[-15px] ml-4">Atsukoro</h2>
                            <div className="badge badge-outline badge-primary mt-[-5px] ml-2">17y.o Male</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-lg font-semibold">Bio</label>
                        <div className="table w-fit max-w-[500px] bg-base-100 p-2 rounded-lg">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error veritatis enim repellendus sapiente sunt adipisci quisquam nobis earum perspiciatis at, quod aperiam expedita suscipit corporis eaque deserunt numquam tempora assumenda?
                        </div>
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