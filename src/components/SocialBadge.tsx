import { FaDiscord, FaGithub, FaLink, FaMailBulk } from "react-icons/fa";
import { Social, SocialType } from "@prisma/client";

const returnInfo = (type: SocialType) => {
    switch(type) {
        case SocialType.DISCORD:
            return {
                color: 'white',
                background: '#7289da',
                icon: <FaDiscord size={20}/>
            };

        case SocialType.EMAIL:
            return {
                color: 'black',
                background: 'white',
                icon: <FaMailBulk size={20}/>
            };

        case SocialType.GITHUB:
            return {
                color: 'white',
                background: 'black',
                icon: <FaGithub size={20}/>
            };

        case SocialType.URL:
            return {
                color: 'black',
                background: 'white',
                icon: <FaLink size={20}/>
            };
    } 
};

const SocialBadge = ({ social }: { social: Omit<Social, 'userId' | 'id'> }) => {
    const data = returnInfo(social.type);

    return (
        <a 
            href={social.url}
            className="badge font-bold text-xs p-4 gap-2 hover:cursor-pointer"
            style={{
                background: data.background,
                color: data.color
            }}
        >
            {data.icon}
            {social.type}
        </a>
    )
}

export default SocialBadge;