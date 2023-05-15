import { Box, Button, Flex, Input, NumberInput, TextInput, Textarea, Text } from "@mantine/core";
import { FaAt, FaPersonBooth } from "react-icons/fa";
import { useForm } from '@mantine/form';
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import Wysiwyg from '@/components/Wysiwyg';

const SettingsModal = () => {
    const editUser = api.user.updateUser.useMutation();
    const me = api.user.getMyself.useQuery();

    const form = useForm({
        initialValues: {
            bio: me.data?.bio || "",
            age: me.data?.age || 0
        }
    });

    const onSubmit = (values: typeof form.values) => {
        editUser.mutateAsync({
            bio: values.bio,
            age: values.age
        })
    }

    return (
        <Box>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Flex gap={10}>
                    <NumberInput
                        {...form.getInputProps('age')}
                        icon={<FaPersonBooth size="1rem" />}
                        placeholder="Your age"
                        label="flkdjflkd"
                        withAsterisk
                        min={1}
                        max={130}
                    />
                </Flex>

                <Box mt={10}>
                    <Text size="sm">Bio</Text>
                    {me.data?.bio && (
                        <Wysiwyg
                            onContentChange={(content) => {
                                form.setValues({
                                    ...form.values,
                                    bio: content
                                });
                            }}
                            content={me.data.bio}
                        />
                    )}
                </Box>


                <Button type="submit" mt={20} variant="filled" onClick={() => { }}>
                    Modify
                </Button>
            </form>
        </Box>
    )
}

export default SettingsModal;