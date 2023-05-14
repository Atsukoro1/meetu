import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "@/utils/api";
import Navbar, { Tab } from "@/components/Navbar";
import NotificationListener from "@/components/NotificationListener";
import { MantineProvider } from '@mantine/core';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css'
import "@/styles/globals.css";
import { useState } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [tab, setTab] = useState<Tab>(Tab.EXPLORE);

  return (
    <MantineProvider 
      withGlobalStyles 
      withNormalizeCSS
      theme={{
        primaryColor: 'indigo',
        colorScheme: 'dark',
        colors: {
          dark: [
            '#d5d7e0',
            '#acaebf',
            '#8c8fa3',
            '#666980',
            '#4d4f66',
            '#34354a',
            '#2b2c3d',
            '#1d1e30',
            '#0c0d21',
            '#01010a',
          ],
        },
      }}
    >
      <SessionProvider session={session}>
        <NotificationListener />
        <Navbar onTabSelect={(tab: Tab) => setTab(tab)} />
        <Component 
          page={tab} 
          {...pageProps} 
        />
      </SessionProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
