import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";

export function DiscordButton() {
    return (
        <Button
            leftIcon={<FaDiscord size="1rem" />}
            onClick={() => signIn("discord")}
            style={{
                background: '#5865F2'
            }}
        >
            Sign in with Discord
        </Button>
    );
}

export function GithubButton() {
    return (
        <Button
            leftIcon={<FaGithub size="1rem" />}
            onClick={() => signIn("github")}
            style={{
                background: 'black'
            }}
        >
            Sign in with Github
        </Button>
    );
}

export function GoogleButton() {
    return (
        <Button
            leftIcon={<FaGoogle size="1rem" />}
            onClick={() => signIn("google")}
            style={{
                background: 'white'
            }}
        >
            Sign in with Google
        </Button>
    );
}

