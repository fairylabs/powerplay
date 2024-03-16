import { type Address, TransactionExecutionError } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { IS_DEBUG } from "./Frame";
import { LOOTERY_ABI } from "./abi/Lootery";
import {
  PICK_AMOUNT,
  MAXIMUM_NUMBER,
  CONTRACT_ADDRESS,
  BONUS_ROUND,
  MINTER_PRIVATE_KEY,
  walletClient,
  publicClient,
  SAFE_ADDRESS,
} from "./config";
import { getRandomPicks } from "./utils/random";

import {
  ENTRYPOINT_ADDRESS_V06,
  createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import { createPublicClient, getContract, http, parseEther } from "viem";

import { base } from "viem/chains";

const pimlicoTransport = http(
  "https://api.pimlico.io/v2/8453/rpc?apikey=2f34f184-f94d-4857-b9b2-166a96dd8f5e",
);

const paymasterClient = createPimlicoPaymasterClient({
  transport: pimlicoTransport,
  entryPoint: ENTRYPOINT_ADDRESS_V06,
});

const bundlerClient = createPimlicoBundlerClient({
  transport: pimlicoTransport,
  entryPoint: ENTRYPOINT_ADDRESS_V06,
});

export async function mintToken(address: Address, numbers: number[]) {
  const bonusPicks1 = Array.from(getRandomPicks(PICK_AMOUNT, MAXIMUM_NUMBER));
  const bonusPicks2 = Array.from(getRandomPicks(PICK_AMOUNT, MAXIMUM_NUMBER));

  const gameId = await publicClient.readContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "currentGameId",
  });

  const isBonusRound = gameId === BONUS_ROUND;

  const signer = privateKeyToAccount(MINTER_PRIVATE_KEY);

  const safeAccount = await signerToSafeSmartAccount(publicClient, {
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    signer,
    safeVersion: "1.4.1",
    address: SAFE_ADDRESS,
  });

  const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    chain: base,
    bundlerTransport: pimlicoTransport,
    middleware: {
      gasPrice: async () =>
        (await bundlerClient.getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
      sponsorUserOperation: paymasterClient.sponsorUserOperation, // optional
    },
  });

  const gasPrices = await bundlerClient.getUserOperationGasPrice();

  // Try minting a new token
  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: LOOTERY_ABI,
    functionName: "ownerPick",
    args: [
      [
        { whomst: address, picks: numbers },
        ...(isBonusRound
          ? [
              // Triple wednesday!
              { whomst: address, picks: bonusPicks1 },
              { whomst: address, picks: bonusPicks2 },
            ]
          : []),
      ],
    ],
    account: signer,
    maxFeePerGas: gasPrices.fast.maxFeePerGas,
    maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas,
  });

  if (!request) {
    throw new Error("Could not simulate contract");
  }

  try {
    if (IS_DEBUG) {
      throw new Error("DEBUGGING", { cause: request });
      return null;
    }

    const hash = await smartAccountClient.writeContract(request);
    return hash;
  } catch (error) {
    if (
      error instanceof TransactionExecutionError &&
      error.details.startsWith("gas required exceeds allowance")
    ) {
      console.error("Gas required exceeds allowance");
    } else {
      console.error(error);
    }
  }

  return null;
}
