import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { ContextProvider } from "./context";
import "./globals.css";
import { config } from "./wagmi";

export const metadata: Metadata = {
  title: "Powerbald",
  description: "The most $DEGEN lottery on Farcaster!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body>
        <ContextProvider initialState={initialState}>
          {children}
        </ContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
