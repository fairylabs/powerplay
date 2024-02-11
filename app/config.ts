import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
  type PublicClient,
} from "viem";
import { baseSepolia, hardhat } from "viem/chains";

export const PICK_AMOUNT = 5;
export const MAXIMUM_NUMBER = 25;

export const LOTTO_ACCOUNT_FID = 233254;

export const CONTRACT_ADDRESS = "0xa72F34926002759F7c87e94E37a3c1ac970C5ccF";
export const CHAIN = baseSepolia;

export const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY! as Hex;

const transport = http(process.env.RPC_URL);

// @ts-ignore
export const publicClient: PublicClient = createPublicClient({
  chain: CHAIN,
  transport,
});

export const walletClient = createWalletClient({
  chain: CHAIN,
  transport,
});
