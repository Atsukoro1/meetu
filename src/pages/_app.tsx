import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "@/utils/api";
import Navbar from "@/components/Navbar";
import NotificationListener from "@/components/NotificationListener";
import themeAtom from "@/atoms/ThemeAtom";
import { useAtom } from 'jotai';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import "daisyui/dist/full.css";
import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [theme, setTheme] = useAtom(themeAtom);

  return (
    <SessionProvider session={session}>
      <div data-theme={theme}>
        <NotificationListener/>
        <Navbar onThemeChange={(value) => setTheme(value)}/>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
