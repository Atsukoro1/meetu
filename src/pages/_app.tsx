import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "@/utils/api";
import Navbar, { Tab } from "@/components/Navbar";
import NotificationListener from "@/components/NotificationListener";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Notifications } from "@mantine/notifications";

const darkModeAtom = atomWithStorage<ColorScheme>('darkMode', "light");

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [tab, setTab] = useState<Tab>(Tab.EXPLORE);

  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(darkMode);

  const toggleColorScheme = (value?: ColorScheme) =>
    setDarkMode(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    setColorScheme(darkMode);
  }, [darkMode]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        <SessionProvider session={session}>
          <NotificationListener />
          <Notifications />
          <Navbar onTabSelect={(tab: Tab) => setTab(tab)} />
          <Component
            page={tab}
            {...pageProps}
          />
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default api.withTRPC(MyApp);