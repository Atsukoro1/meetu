import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { FilePond, registerPlugin } from "react-filepond";
import { Gender, Social, SocialType } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { AiOutlinePlus } from "react-icons/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { uploadFile } from '@/utils/supabase';
import { useSession } from 'next-auth/react';
import { FaTrash } from 'react-icons/fa';
import { prisma } from '@/server/db';
import { api } from '@/utils/api';
import { env } from '@/env.mjs';
import {
    Badge,
    Box,
    Button,
    Flex,
    Input,
    NumberInput,
    Paper,
    Select,
    Stepper,
    Text,
    Textarea
} from '@mantine/core';

interface StepOneResult {
    age: number;
    bio: string;
    gender: Gender
}

interface StepTwoResult {
    hobbies: string[],
    socials: Omit<Social, 'userId' | 'id'>[]
}

interface StepThreeResult {
    image: string;
    banner: string;
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
            <NumberInput
                placeholder='Age'
                min={0}
                max={100}
                label={`Your age`}
                onChange={(value) => {
                    if (typeof value === 'string') return;

                    setData({
                        ...data,
                        age: value as number
                    });
                }}
                value={data.age}
            />

            <Textarea
                mt={10}
                label="Bio"
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

            <Select
                mt={10}
                label="Your gender"
                value={data.gender}
                data={[
                    { value: Gender.FEMALE, label: "Female" },
                    { value: Gender.MALE, label: "Male" }
                ]}
                onChange={(value) => {
                    setData({
                        ...data,
                        gender: value as Gender
                    });
                }}
            />
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
                    <Text>Add hobbies</Text>
                    <Flex gap={5} direction="row" wrap="wrap">
                    {data.hobbies.map(el => {
                            return (
                                <Badge  
                                    key={el}
                                    onClick={() => removeHobby(el)} 
                                    rightSection={<FaTrash/>}
                                    size="lg"
                                    sx={{ cursor: "pointer" }}
                                >
                                    {el}
                                </Badge>
                            )
                        })}
                    </Flex>

                    <Flex direction="row" wrap="wrap" mt={5} gap={10}>
                        <Input
                            type="text"
                            placeholder="New hobby name..."
                            value={newHobby}
                            onChange={(e) => setNewHobby(e.target.value)}
                        />

                        <Button
                            onClick={pushHobbies}
                            rightIcon={<AiOutlinePlus size={20} color="white" />}
                        >
                            Add
                        </Button>
                    </Flex>

                    <Text mt={15}>Add socials</Text>
                    <Box>
                        <Flex direction="row" wrap="wrap">
                            {data.socials.map(el => {
                                return (<Badge key={el.url} size='lg'>{el.text}</Badge>)
                            })}
                        </Flex>

                        <Select
                            mt={5}
                            value={newSocialData.type}
                            onChange={(value) => {
                                changeSocialData("type", value as SocialType);
                            }}
                            label="Your favorite framework/library"
                            placeholder="Pick one"
                            data={[
                                { value: SocialType.DISCORD, label: 'Discord' },
                                { value: SocialType.EMAIL, label: 'Email' },
                                { value: SocialType.GITHUB, label: 'Github' },
                                { value: SocialType.URL, label: 'Url' },
                            ]}
                        />

                        <Input
                            mt={5}
                            type="text"
                            placeholder="Text"
                            value={newSocialData.text || ""}
                            onChange={(e) => changeSocialData("text", e.target.value)}
                        />

                        <Input
                            mt={5}
                            type="text"
                            placeholder="Url / content"
                            value={newSocialData.url}
                            onChange={(e) => changeSocialData("url", e.target.value)}
                        />

                        <Button mt={10} onClick={addSocial}>
                            Add
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    )
}

const StepThree = ({ onResult }: { onResult: (data: StepThreeResult) => void }) => {
    const [result, setResult] = useState<StepThreeResult>({
        image: "",
        banner: ""
    });
    const { data } = useSession();

    useEffect(() => onResult(result), [result]);

    registerPlugin(FilePondPluginImagePreview);

    return (
        <Box>
            <Text>Upload profile picture</Text>
            <FilePond
                allowMultiple={false}
                maxFiles={1}
                name="files"
                onaddfile={async (error, file) => {
                    if (error) return;

                    if (await uploadFile(
                        `pfps/${data?.user.id}`,
                        new File([file.file], file.file.name, {
                            type: file.file.type,
                        }),
                        "test"
                    )) {
                        setResult({
                            ...result,
                            image: `${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/pfps/${data?.user.id}`
                        });
                    };
                }}
                labelIdle='Drag & Drop your profile picture <span class="filepond--label-action">or click here</span>'
            />

            <Text className="mb-1 mt-4">Upload banner</Text>
            <FilePond
                allowMultiple={false}
                maxFiles={1}
                name="files"
                onaddfile={async (error, file) => {
                    if (error) return;

                    if (await uploadFile(
                        `banner/${data?.user.id}`,
                        new File([file.file], file.file.name, {
                            type: file.file.type,
                        }),
                        "test"
                    )) {
                        setResult({
                            ...result,
                            banner: `${env.NEXT_PUBLIC_SUPABASE_PUBLIC_STORAGE_URL}/banner/${data?.user.id}`
                        });
                    };
                }}
                labelIdle='Drag & Drop your banner <span class="filepond--label-action">or click here</span>'
            />
        </Box>
    )
}

const SetupPage = () => {
    const [active, setActive] = useState(1);
    const [highestStepVisited, _] = useState(active);
    const [stepOneResult, setStepOneResult] = useState<StepOneResult>();
    const [stepTwoResult, setStepTwoResult] = useState<StepTwoResult>();
    const [stepThreeResult, setStepThreeResult] = useState<StepThreeResult>();

    const updateUser = api.user.updateUser.useMutation();
    const router = useRouter();

    const incrementPage = () => {
        switch (active) {
            case 0:
                updateUser.mutateAsync(stepOneResult as any);
                break;
            case 1:
                updateUser.mutateAsync(stepTwoResult as any)
                break;
            case 2:
                updateUser.mutateAsync(stepThreeResult as any);
                break;
            case 3:
                updateUser.mutateAsync({
                    setupDone: true
                });

                router.push('/app');
                break;
        }

        setActive(active + 1);
    }

    const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

    return (
        <Paper withBorder mx={"auto"} w={900} p={20} radius={10}>
            <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                <Stepper.Step
                    label="Basic information"
                    description="Provide some basics about you"
                    allowStepSelect={shouldAllowSelectStep(0)}
                >
                    <StepOne onResult={(data) => {
                        setStepOneResult(data);
                    }} />
                </Stepper.Step>

                <Stepper.Step
                    label="Second step"
                    description="Verify email"
                    allowStepSelect={shouldAllowSelectStep(1)}
                >
                    <StepTwo onResult={(data) => {
                        setStepTwoResult(data);
                    }} />
                </Stepper.Step>

                <Stepper.Step
                    label="Final step"
                    description="Get full access"
                    allowStepSelect={shouldAllowSelectStep(2)}
                >
                    <StepThree onResult={(data) => {
                        setStepThreeResult(data);
                    }} />
                </Stepper.Step>

                <Stepper.Step
                    label="Done"
                    description="Click continue to explore Meetu network"
                    allowStepSelect={shouldAllowSelectStep(3)}
                />
            </Stepper>

            <Button mt={15} onClick={incrementPage}>
                Continue
            </Button>
        </Paper>
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
