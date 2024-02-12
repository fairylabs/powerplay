import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base, mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { CHAIN } from "./config";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Powerbald",
  description: "The most $DEGEN lottery on farcaster",
  url: "https://powerbald.xyz",
  icons: [],
};

// Create wagmiConfig
export const config = createConfig({
  chains: [CHAIN],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
