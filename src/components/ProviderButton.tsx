import { ClientSafeProvider, signIn } from "next-auth/react";
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import { AiFillGithub } from "react-icons/ai";

const ProviderButton = ({ provider }: { provider: ClientSafeProvider }) => {
    const returnIcon = (name: string) => {
        switch(name.toLowerCase()) {
            case "github": return <AiFillGithub className="text-background" size={25} />
            case "google": return <FaGoogle className="text-background" size={25} />
            case "discord": return <FaDiscord className="text-background" size={25} />
        }
    };

    return (
        <button
            onClick={() => signIn(provider.id)}
            className="w-full btn btn-primary gap-2"
        >
            {returnIcon(provider.name)}
            Sign in with 
        </button>
    )
}

export default ProviderButton;