const Profile = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="card-normal bg-neutral h-fit overflow-hidden">
                <div>
                    <img
                        src="https://c4.wallpaperflare.com/wallpaper/923/689/83/japan-sakura-pink-beautiful-wallpaper-preview.jpg"
                        className="rounded-xl h-[205px] w-[550px] object-cover"
                    />
                </div>

                <div className="p-5">
                    <div className="flex flex-row">
                        <div>
                            <div className="avatar online mt-[-70px]">
                                <div className="w-24 rounded-xl">
                                    <img src="https://cdn.discordapp.com/avatars/937757295453044806/1eaa758caacdc9a7f92bb49617d91be0.webp" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">Atsukoro</h2>
                            <p className="table w-[400px]">Lorem ipsum dolor sit amet consectetur, adipisicing elit. </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;