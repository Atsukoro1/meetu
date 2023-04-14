import { SocialType } from "@prisma/client";
import { z } from "zod";

export const UpdateUserSchema = z.object({
  setupDone: z.boolean().optional(),
  hobbies: z.array(z.string()).optional(),
  age: z.number().optional(),
  image: z.string().optional(),
  bio: z.string().optional(),
  socials: z
    .array(
      z.object({
        type: z.enum([
          SocialType.DISCORD,
          SocialType.EMAIL,
          SocialType.GITHUB,
          SocialType.URL,
        ]),
        text: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});
