import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Powerbald",
  description: "The most $DEGEN lottery on Farcaster!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
