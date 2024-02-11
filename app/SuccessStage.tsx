import { kv } from "@vercel/kv";
import type { FrameActionDataParsedAndHubContext } from "frames.js";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  type PreviousFrame,
} from "frames.js/next/server";
import type { SatoriOptions } from "satori";
import { TransactionExecutionError, getAddress, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Stage, State, getStorageKey, type MintData } from "./Frame";
import { LOOTERY_ABI } from "./abi/Lootery";
import {
  CHAIN,
  CONTRACT_ADDRESS,
  MINTER_PRIVATE_KEY,
  PICK_AMOUNT,
  publicClient,
  walletClient,
} from "./config";

export async function SuccessStage({
  gameId,
  userData,
  frameImageOptions,
  previousFrame,
  state,
  frameMessage,
}: {
  gameId: number;
  userData: MintData | null;
  frameImageOptions: SatoriOptions;
  previousFrame: PreviousFrame<State>;
  state: State;
  frameMessage: FrameActionDataParsedAndHubContext | null;
}) {
  let finalUserData = userData;
  if (!userData && state.stage === Stage.SUCCESS) {
    if (frameMessage && state.numbers?.length === PICK_AMOUNT) {
      const address = frameMessage.requesterVerifiedAddresses[0];
      if (!address) {
        throw new Error("Invalid address");
      }

      const hash = await mintToken(getAddress(address), state.numbers);

      if (!hash) throw new Error("Could not mint token");

      const data: MintData = {
        fid: frameMessage.requesterFid,
        hash,
        timestamp: new Date().toISOString(),
        numbers: state.numbers,
      };

      await kv.hset(getStorageKey(gameId, frameMessage.requesterFid), data);

      console.log("NEW MINT", data);
      finalUserData = data;
    }
  }

  return (
    <FrameContainer
      postUrl="/frames"
      state={state}
      previousFrame={previousFrame}
      pathname="/"
    >
      <FrameImage options={frameImageOptions}>
        <div tw="w-full h-full bg-[#2151f5] text-white flex flex-col items-center justify-center text-7xl">
          <div tw="mb-10">Congratulations!</div>
          <div tw="mb-10">You&apos;ve claimed today&apos;s ticket</div>
          <div tw="flex text-8xl mb-10">
            {(state.numbers ?? finalUserData?.numbers ?? []).map((num) => (
              <div
                tw="flex flex-shrink-0 0 items-center justify-center w-40 h-40 border-white border-4 rounded-full mx-5 pt-4"
                key={num}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </FrameImage>
      <FrameButton
        action="link"
        target={`${CHAIN.blockExplorers.default.url}/tx/${finalUserData?.hash}`}
      >
        TX
      </FrameButton>
      <FrameButton action="link" target="https://warpcast.com/~/channel/lotto">
        Visit /lotto for news
      </FrameButton>
    </FrameContainer>
  );
}

async function mintToken(address: Address, numbers: number[]) {
  // Try minting a new token
  const { request } = await publicClient.simulateContract({
    address: CONTRACT_ADDRESS,
    abi: LOOTERY_ABI,
    functionName: "ownerPick",
    args: [[{ whomst: address, picks: numbers }]],
    account: privateKeyToAccount(MINTER_PRIVATE_KEY),
  });

  if (!request) {
    throw new Error("Could not simulate contract");
  }

  try {
    const hash = await walletClient.writeContract(request);
    return hash;
  } catch (error) {
    if (
      error instanceof TransactionExecutionError &&
      error.details.startsWith("gas required exceeds allowance")
    ) {
      console.error("Gas required exceeds allowance");
    }
  }

  return null;
}
