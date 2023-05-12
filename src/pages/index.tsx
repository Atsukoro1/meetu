import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ProviderButton from "@/components/ProviderButton";
import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react"
import { CiCoffeeCup } from 'react-icons/ci';
import { authOptions } from "@/server/auth";
import { MessagePlaceholder } from "@/components/Message";



export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="mockup-phone border-primary">
        <div className="camera"></div>
        <div className="display">
          <div className="artboard artboard-demo phone-1">
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
            <MessagePlaceholder/>
          </div>
        </div>
      </div>

      <div className="hero-content bg-primary bg-opacity-70 rounded-lg w-[800px] flex-col lg:flex-row-reverse gap-8">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl text-white font-bold">Login now!</h1>
          <p className="py-6 text-white table w-[300px]">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
            exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>

        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <ProviderButton provider={provider} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/app" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  }
}
