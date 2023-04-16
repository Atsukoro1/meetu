import { z } from "zod";

export const CreatePostSchema = z.object({
    content: z.string().min(1).max(2048)
});

export const ToggleInteractionSchema = z.object({
    type: z.enum(["DISLIKE", "LIKE"]),
    postId: z.string()
});

export const FetchPostsSchema = z.object({
    page: z.number().min(1).default(1),
    perPage: z.number().default(10)
});