import { prisma } from "@/server/db";
import { UpdateUserSchema } from "../schema/user";

export const updateUserResolver = async (
    { user }: any,
    data: typeof UpdateUserSchema._input
): Promise<void> => {
    await prisma.user.update({
        where: {
            id: user.id   
        },
        data: {
            ...data.age && { age: data.age },
            ...data.bio && { bio: data.bio },
            ...data.hobbies && { hobbies: data.hobbies },
            ...data.image && { image: data.image },
            ...data.setupDone && { setupDone: data.setupDone },
            ...data.socials && {
                socials: {
                    createMany: {
                        data: data.socials.map(el => {
                            return {
                                type: el.type,
                                text: el.text,
                                url: el.url
                            }
                        })
                    }
                }
            }
        }
    });
}