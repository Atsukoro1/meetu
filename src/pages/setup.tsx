import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePond, registerPlugin } from "react-filepond";
import { Gender, Social, SocialType } from "@prisma/client";
import SocialBadge from '@/components/SocialBadge';
import { GetServerSidePropsContext } from "next";
import { AiOutlinePlus } from "react-icons/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from '@/utils/api';
import { prisma } from '@/server/db';

interface StepOneResult {
    age: number;
    bio: string;
    gender: Gender
}

interface StepTwoResult {
    hobbies: string[],
    socials: Omit<Social, 'userId' | 'id'>[]
}

const StepOne = ({ onResult }: { onResult: (data: StepOneResult) => void }) => {
    const [data, setData] = useState<StepOneResult>({
        age: 0,
        bio: "",
        gender: Gender.MALE
    });

    useEffect(() => {

        onResult({
            ...data,
            gender: data.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE
        });
    }, [data]);

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
            <div className="mt-2 mb-4">
                <textarea
                    className="textarea textarea-primary w-full"
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

            <label>Gender</label>
            <div className="form-control mb-2">
                <label className="label cursor-pointer w-fit gap-2">
                    <span className="label-text">Male</span>
                    <input 
                        type="checkbox" 
                        className="toggle toggle-primary" 
                        checked={data.gender === Gender.MALE} 
                        onChange={() => {
                            setData({
                                ...data,
                                gender: data.gender === Gender.MALE ? Gender.FEMALE : Gender.MALE
                            })
                        }}
                    />
                    <span className="label-text">Female</span>
                </label>
            </div>
        </div>
    )
}

const StepTwo = ({ onResult }: { onResult: (data: StepTwoResult) => void }) => {
    const [newHobby, setNewHobby] = useState<string>("");
    const [newSocialData, setNewSocialData] = useState<Omit<Social, "id" | "userId">>({
        url: "",
        text: "",
        type: SocialType.URL
    });
    const [data, setData] = useState<StepTwoResult>({
        hobbies: [],
        socials: []
    });

    useEffect(() => {
        onResult(data);
    }, [data]);

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

    const addSocial = () => {
        data.socials.push(newSocialData);
        setData({
            ...data,
            socials: data.socials
        });

        setNewSocialData({
            url: "",
            text: "",
            type: SocialType.URL
        });
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
                        <div className='flex flex-wrap max-w-[400px]'>
                            {data.socials.map(el => {
                                return (<SocialBadge social={el} />)
                            })}
                        </div>

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

                        <button
                            className='ml-3 btn btn-primary'
                            onClick={addSocial}
                        >
                            Add
                        </button>
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
    const [stepOneResult, setStepOneResult] = useState<StepOneResult>();
    const [stepTwoResult, setStepTwoResult] = useState<StepTwoResult>();

    const updateUser = api.user.updateUser.useMutation();
    const [page, setPage] = useState<number>(1);
    const router = useRouter();

    const incrementPage = () => {
        switch (page) {
            case 1:
                updateUser.mutateAsync(stepOneResult as any);
                break;
            case 2:
                updateUser.mutateAsync(stepTwoResult as any)
                break;
            case 4:
                updateUser.mutateAsync({
                    setupDone: true
                })
                break;
        }

        setPage(page + 1);

        if (page > 3) {
            router.push("/app");
        }
    }

    const renderPage = () => {
        switch (page) {
            case 1: return <StepOne onResult={(data) => {
                setStepOneResult(data);
            }} />
            case 2: return <StepTwo onResult={(data) => {
                setStepTwoResult(data);
            }} />
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

    const user = await prisma.user.findFirst({
        where: {
            id: session.user.id
        }
    });

    if (user?.setupDone) {
        return {
            redirect: {
                destination: "/app"
            }
        }
    };

    return {
        props: {}
    }
}
