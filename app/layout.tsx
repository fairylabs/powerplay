import { Metadata } from "next";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { ContextProvider } from "./context";
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
      </body>
    </html>
  );
}
