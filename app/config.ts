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

export const FOLLOW_ACCOUNT_FID = 233254;
export const FOLLOW_ACCOUNT_USERNAME = "lottopgf";

export const BONUS_ROUND = 9n; // Bonus tickets for this round!

export const FID_ALLOW_LIST = [
  194499, // stefan
];
export const FID_OG_LIMIT = 25000; // anyone under 25k is allowed to enter

export const CONTRACT_ADDRESS = "0xc94e65A6d6C145B6A0342dA9b5e8Dc3928505857";
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
