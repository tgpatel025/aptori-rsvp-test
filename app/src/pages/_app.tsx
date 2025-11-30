import RootLayout from "@/layouts";
import "@/styles/globals.css";
import { Auth0Provider } from "@auth0/auth0-react";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${process.env.NEXT_PUBLIC_WEBSITE_URL}`
      }}>
      <Head>
        <title>Aptori RSVP App</title>
      </Head>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </Auth0Provider>
  );
}
