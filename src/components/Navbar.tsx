import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
    const { data } = useSession();

    return (
        <div className="navbar bg-neutral">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">MEETU</a>
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
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
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