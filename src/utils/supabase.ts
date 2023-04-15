import { createClient } from "@supabase/supabase-js";
import { env } from "@/env.mjs";

export const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL, 
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function uploadFile(
    name: string, 
    file: File,
    bucket: string
): Promise<boolean> {
    const { error } = await supabase.storage
        .from(bucket)
        .upload(name, file, {
            cacheControl: "public, max-age=31536000",
            upsert: true
        });

    return !error;
}