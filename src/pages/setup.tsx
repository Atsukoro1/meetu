import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePond, registerPlugin } from "react-filepond";
import { Social, SocialType } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AiOutlinePlus } from "react-icons/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/router";
import { useState } from "react";

const StepOne = () => {
    const [data, setData] = useState({
        age: 0,
        bio: ""
    });

    return (
        <div className="mt-2">
            <h2 className="text-2xl font-bold mb-1 mt-4">Welcome</h2>
            <p className="table w-[400px] mb-4">We're so glad to welcome a new member here, let's start by filling some basics about you.</p>

            <label>Age</label>
            <div className="flex gap-3 mb-4 mt-2">
                <input
                    type="range"
                    min="0"
                    max="100"
                    onChange={(e) => {
                        setData({
                            ...data,
                            age: parseInt(e.target.value)
                        })
                    }}
                    value={data.age}
                    className="range range-primary"
                />

                <label>{data.age.toString()}</label>
            </div>

            <label>Bio</label>
            <div className="mt-2">
                <textarea
                    className="textarea textarea-primary w-full placeholder:text-orange-200 placeholder:opacity-30"
                    placeholder="Some short text about you..."
                    value={data.bio}
                    onChange={(e) => {
                        setData({
                            ...data,
                            bio: e.target.value
                        })
                    }}
                />
            </div>
        </div>
    )
}

const StepTwo = () => {
    const [newHobby, setNewHobby] = useState<string>("");
    const [newSocialData, setNewSocialData] = useState<Omit<Social, "id" | "userId">>({
        url: "",
        text: "",
        type: SocialType.URL
    });
    const [data, setData] = useState<{ hobbies: string[], socials: Social[] }>({
        hobbies: [],
        socials: []
    });

    const changeSocialData = <T extends keyof typeof newSocialData,>(
        key: T,
        value: typeof newSocialData[T]
    ): void => {
        setNewSocialData({
            ...newSocialData,
            [key]: value
        });
    }

    const pushHobbies = () => {
        if (newHobby === '') return;

        data.hobbies.push(newHobby);
        setData({
            ...data,
            hobbies: data.hobbies
        });

        setNewHobby("");
    }

    const removeHobby = (content: string) => {
        const index = data.hobbies.findIndex(el => el === content);

        if (index !== -1) {
            data.hobbies.splice(index, 1)
            setData({
                ...data,
                hobbies: data.hobbies
            });
        }
    }

    return (
        <div className="mt-2">
            <div className="flex flex-row">
                <div className="form-control">
                    <label className="mb-1 mt-4">Add hobbies</label>
                    <div className="flex flex-wrap gap-2 w-[500px] mb-2">
                        {data.hobbies.map(el => {
                            return (
                                <div
                                    className="badge badge-primary gap-2"
                                    onClick={() => removeHobby(el)}
                                >
                                    <ImCross
                                        className="text-neutral hover:opacity-60 hover:cursor-pointer"
                                        size={10}
                                    />

                                    {el}
                                </div>
                            )
                        })}
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="New hobby name..."
                            className="input input-bordered"
                            value={newHobby}
                            onChange={(e) => setNewHobby(e.target.value)}
                        />

                        <button
                            className="btn btn-square bg-primary hover:bg-primary"
                            onClick={pushHobbies}
                        >
                            <AiOutlinePlus size={20} color="white" />
                        </button>
                    </div>

                    <label className="mb-1 mt-4">Add socials</label>
                    <div>
                        <select
                            value={newSocialData.type}
                            onChange={(e) => {
                                changeSocialData("type", e.target.value as SocialType);
                            }}
                            className="select select-bordered w-full max-w-xs mt-2"
                        >
                            <option value={SocialType.DISCORD}>Discord</option>
                            <option value={SocialType.EMAIL}>Email</option>
                            <option value={SocialType.GITHUB}>Github</option>
                            <option value={SocialType.URL}>Url</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Text"
                            className="input input-bordered block mt-3"
                            value={newSocialData.text || ""}
                            onChange={(e) => changeSocialData("text", e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Url / content"
                            className="input input-bordered mt-3 mb-3"
                            value={newSocialData.url}
                            onChange={(e) => changeSocialData("url", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const StepThree = () => {
    registerPlugin(FilePondPluginImagePreview);

    return (
        <div className="mt-2">
            <label className="mb-1 mt-6">Upload profile picture</label>

            <div className="mt-3">
                <FilePond
                    allowMultiple={false}
                    maxFiles={1}
                    name="files"
                    labelIdle='Drag & Drop your profile picture <span class="filepond--label-action">or click here</span>'
                />
            </div>

            <label className="mb-1 mt-4">Upload banner</label>
            <div className="mt-3">
                <FilePond
                    allowMultiple={false}
                    maxFiles={1}
                    name="files"
                    labelIdle='Drag & Drop your profile picture <span class="filepond--label-action">or click here</span>'
                />
            </div>
        </div>
    )
}

const StepFour = () => {
    return (
        <div className="mt-2">
            <h2 className="text-2xl font-bold mb-1 mt-4">Well done!</h2>
            <p className="table w-[400px] mb-4">You're now ready to explore the MEETU network!</p>
        </div>
    )
}

const SetupPage = () => {
    const [page, setPage] = useState<number>(1);
    const router = useRouter();

    const incrementPage = () => {
        setPage(page + 1);

        if(page > 3) {
            router.push("/app");
        }
    }

    const renderPage = () => {
        switch (page) {
            case 1: return <StepOne />
            case 2: return <StepTwo />
            case 3: return <StepThree />
            case 4: return <StepFour />
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="card-normal bg-neutral rounded-xl p-8">
                <div className="mb-2">
                    <ul className="steps">
                        <li className={`step ${page >= 1 && "step-primary"}`}>Basic info!</li>
                        <li className={`step ${page >= 2 && "step-primary"}`}>More about you</li>
                        <li className={`step ${page >= 3 && "step-primary"}`}>Graphics</li>
                        <li className={`step ${page >= 4 && "step-primary"}`}>Done!</li>
                    </ul>
                </div>

                <div className="mt-2">
                    {renderPage()}

                    <button
                        className="btn btn-active btn-primary mt-3"
                        onClick={incrementPage}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SetupPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) {
        return { redirect: { destination: "/" } };
    }

    return {
        props: {}
    }
}
