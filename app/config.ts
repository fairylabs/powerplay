import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
  type PublicClient,
} from "viem";
import { base } from "viem/chains";

export const PICK_AMOUNT = 5;
export const MAXIMUM_NUMBER = 25;

export const LOTTO_ACCOUNT_FID = 233254;

export const CONTRACT_ADDRESS = "0x0";
export const CHAIN = base;

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
