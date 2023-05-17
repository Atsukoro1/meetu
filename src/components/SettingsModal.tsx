import { Box, Button, Flex, Input, NumberInput, TextInput, Textarea, Text } from "@mantine/core";
import { FaAt, FaPersonBooth } from "react-icons/fa";
import { useForm } from '@mantine/form';
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import Wysiwyg from '@/components/Wysiwyg';
import { showNotification } from "@mantine/notifications";

const SettingsModal = ({ onClose }: { onClose: () => void; }) => {
    const editUser = api.user.updateUser.useMutation({
        onSuccess: () => {
            showNotification({
                message: "Profile edit",
                title: "Succefully edited your profile"
            });

            onClose();
        }
    });

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
                        <Wysiwyg
                            onContentChange={(content) => {
                                form.setValues({
                                    ...form.values,
                                    bio: content
                                });
                            }}
                            content={me.data?.bio || ""}
                        />
                </Box>


                <Button 
                    loading={editUser.isLoading} 
                    type="submit" 
                    mt={20} 
                    variant="filled"
                >
                    Modify
                </Button>
            </form>
        </Box>
    )
}

export default SettingsModal;