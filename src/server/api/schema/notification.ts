import { z } from "zod";

export const FetchNotificationsSchema = z.object({
    page: z.number().default(1),
    perPage: z.number().default(10)
});