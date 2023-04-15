import slugify from "@/utils/slugify";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
    const { data } = useSession();

    return (
        <div className="navbar bg-neutral">
            <div className="flex-1">
                <Link className="btn btn-ghost normal-case text-xl" href="/app">
                    MEETU
                </Link>
            </div>
            <div className="flex-none">
                {data?.user
                    ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img src={data?.user.image || ""} />
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <Link href={`/profile/${slugify(data.user.name || "")}`}>
                                    <li>
                                        <a className="justify-between">
                                            Profile
                                            <span className="badge">New</span>
                                        </a>
                                    </li>
                                </Link>
                                <li onClick={() => signOut()}><a>Logout</a></li>
                            </ul>
                        </div>
                    ) : (
                        <button className="ml-3 btn btn-sm btn-primary">
                            Sign in
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar;