import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function ConnectButton() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  return (
    <div className="flex justify-center min-h-10">
      {isConnected ? (
        <w3m-button />
      ) : (
        <button
          onClick={() => open()}
          className="bg-white text-blue-700 px-4 font-black cursor-pointer"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
