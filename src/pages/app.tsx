import Post from "@/components/Post";
import PostInput from "@/components/PostInput";
import ProfileCard from "@/components/ProfileCard";
import ProfileHighlight from "@/components/ProfileHighlight";
import { NextPage } from "next";

const AppPage: NextPage = () => {
    return (
        <div className="flex">
            <div className="w-[30%]">
                <ProfileHighlight/>
            </div>

            <div className="w-[45%] p-3">
                <div className="h-fit mx-auto w-full p-4">
                    <PostInput/>
                </div>

                <div className="gap-2 flex flex-col">
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                    <Post/>
                </div>
            </div>

            <div className="p-3 w-[25%]">
                <h2 className="font-bold text-xl mb-2">Well known people</h2>
                <div className="flex flex-col gap-4">
                    <ProfileCard user={{ "id": "clghlyo770000vsc8kj0cini4", "name": "Atsukoro1", "slug": "atsukoro1", "email": "dornicakkuba@gmail.com", "emailVerified": null, "gender": "FEMALE", "setupDone": true, "hobbies": [], "age": 100, "image": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/pfps/clghlyo770000vsc8kj0cini4", "banner": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/banner/clghlyo770000vsc8kj0cini4", "bio": "asdfasfdsfadasfdsadf" }} />
                    <ProfileCard user={{ "id": "clghlyo770000vsc8kj0cini4", "name": "Atsukoro1", "slug": "atsukoro1", "email": "dornicakkuba@gmail.com", "emailVerified": null, "gender": "FEMALE", "setupDone": true, "hobbies": [], "age": 100, "image": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/pfps/clghlyo770000vsc8kj0cini4", "banner": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/banner/clghlyo770000vsc8kj0cini4", "bio": "asdfasfdsfadasfdsadf" }} />
                    <ProfileCard user={{ "id": "clghlyo770000vsc8kj0cini4", "name": "Atsukoro1", "slug": "atsukoro1", "email": "dornicakkuba@gmail.com", "emailVerified": null, "gender": "FEMALE", "setupDone": true, "hobbies": [], "age": 100, "image": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/pfps/clghlyo770000vsc8kj0cini4", "banner": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/banner/clghlyo770000vsc8kj0cini4", "bio": "asdfasfdsfadasfdsadf" }} />
                </div>

                <h2 className="font-bold text-xl mt-5 mb-2">You might know</h2>
                <div className="flex flex-col gap-4">
                    <ProfileCard user={{ "id": "clghlyo770000vsc8kj0cini4", "name": "Atsukoro1", "slug": "atsukoro1", "email": "dornicakkuba@gmail.com", "emailVerified": null, "gender": "FEMALE", "setupDone": true, "hobbies": [], "age": 100, "image": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/pfps/clghlyo770000vsc8kj0cini4", "banner": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/banner/clghlyo770000vsc8kj0cini4", "bio": "asdfasfdsfadasfdsadf" }} />
                    <ProfileCard user={{ "id": "clghlyo770000vsc8kj0cini4", "name": "Atsukoro1", "slug": "atsukoro1", "email": "dornicakkuba@gmail.com", "emailVerified": null, "gender": "FEMALE", "setupDone": true, "hobbies": [], "age": 100, "image": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/pfps/clghlyo770000vsc8kj0cini4", "banner": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/banner/clghlyo770000vsc8kj0cini4", "bio": "asdfasfdsfadasfdsadf" }} />
                    <ProfileCard user={{ "id": "clghlyo770000vsc8kj0cini4", "name": "Atsukoro1", "slug": "atsukoro1", "email": "dornicakkuba@gmail.com", "emailVerified": null, "gender": "FEMALE", "setupDone": true, "hobbies": [], "age": 100, "image": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/pfps/clghlyo770000vsc8kj0cini4", "banner": "https://suzgouwjcfrjbflbabgl.supabase.co/storage/v1/object/public/test/banner/clghlyo770000vsc8kj0cini4", "bio": "asdfasfdsfadasfdsadf" }} />
                </div>
            </div>
        </div>
    )
}

export default AppPage;