import { UpdateUserSchema } from "../schema/user";

export const updateUserResolver = async (
    { user }: any,
    data: typeof UpdateUserSchema._input
): Promise<void> => {

}