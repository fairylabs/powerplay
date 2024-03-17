import { TransactionExecutionError, type Address } from "viem";
import { LOOTERY_ABI } from "./abi/Lootery";
import {
  BONUS_ROUND,
  CONTRACT_ADDRESS,
  MAXIMUM_NUMBER,
  MINTER_PRIVATE_KEY,
  PICK_AMOUNT,
  SAFE_ADDRESS,
  publicClient,
} from "./config";
import { getRandomPicks } from "./utils/random";

import {
  ENTRYPOINT_ADDRESS_V06,
  createSmartAccountClient,
} from "permissionless";
import { privateKeyToSafeSmartAccount } from "permissionless/accounts";
import { createPimlicoBundlerClient } from "permissionless/clients/pimlico";
import { getContract, http } from "viem";

import { base } from "viem/chains";
import { IS_DEBUG } from "./Frame";

const pimlicoTransport = http(
  "https://api.pimlico.io/v1/base/rpc?apikey=2f34f184-f94d-4857-b9b2-166a96dd8f5e",
);

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

  const account = await privateKeyToSafeSmartAccount(publicClient, {
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    privateKey: MINTER_PRIVATE_KEY,
    safeVersion: "1.4.1",
    address: SAFE_ADDRESS,
  });

  const smartAccountClient = createSmartAccountClient({
    account,
    entryPoint: ENTRYPOINT_ADDRESS_V06,
    chain: base,
    bundlerTransport: pimlicoTransport,
    middleware: {
      gasPrice: async () =>
        (await bundlerClient.getUserOperationGasPrice()).fast,
    },
  });

  const gasPrices = await bundlerClient.getUserOperationGasPrice();

  const lootery = getContract({
    address: CONTRACT_ADDRESS,
    abi: LOOTERY_ABI,
    client: {
      public: publicClient,
      wallet: smartAccountClient,
    },
  });

  try {
    if (IS_DEBUG) {
      throw new Error("DEBUGGING");
      return null;
    }

    const hash = await lootery.write.ownerPick(
      [
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
      {
        account,
        maxFeePerGas: gasPrices.fast.maxFeePerGas,
        maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas,
      },
    );

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
