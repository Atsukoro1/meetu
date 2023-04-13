import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ProviderButton from "@/components/ProviderButton";
import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react"
import { CiCoffeeCup } from 'react-icons/ci';
import { authOptions } from "@/server/auth";

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="card-normal w-full max-w-md p-8 space-y-4 rounded-xl shadow-md">
        <CiCoffeeCup size={60} className="w-fit mb-[-13px] mx-auto text-primary"/>

        <h1 className="text-3xl text-primary font-bold text-center">
          MEETU
        </h1>
        
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <ProviderButton provider={provider}/>
          </div>
        ))}
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
