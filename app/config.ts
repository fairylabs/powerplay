import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
  type PublicClient,
  type Address,
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

export const CONTRACT_ADDRESS = "0x3d940FF48D32CC09DddC287Afa60Ef3c4d68e3bA";
export const CHAIN = base;

export const SAFE_ADDRESS: Address =
  "0x3dE07A228E3cb053cd50Ddc7cCB7a20fd59Ee879";

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
