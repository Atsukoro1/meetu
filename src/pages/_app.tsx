import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { api } from "@/utils/api";

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import 'filepond/dist/filepond.min.css';
import "daisyui/dist/full.css";
import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div data-theme="coffee">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
