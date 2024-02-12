import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { ContextProvider } from "./context";
import "./globals.css";
import { config } from "./wagmi";

export const metadata: Metadata = {
  title: "Powerbald - The most $DEGEN lottery on farcaster",
  description: "Your chance to win 1,000,000 $DEGEN every day",
  icons:
    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔵</text></svg>",
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
