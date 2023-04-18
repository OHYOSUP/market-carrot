import useUser from "@libs/client/useUser";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";


function CustomUser(){
  const { user } = useUser();
  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;
  return (
    <SWRConfig
      value={{ fetcher: (url: string) => fetch(url).then((res) => res.json()) }}
    >
      <CustomUser />
      <div className="w-full max-w-xl mx-auto">
        <AnyComponent {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
