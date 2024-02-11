import { UTCDate } from "@date-fns/utc";
import { kv } from "@vercel/kv";
import { endOfDay, formatDistance } from "date-fns";
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
import { HOST, Stage, State, getStorageKey, type MintData } from "./Frame";
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

  const countdown = "midnight UTC tomorrow"; // formatDistance(new UTCDate(), endOfDay(new UTCDate()));

  return (
    <FrameContainer
      postUrl="/frames"
      state={state}
      previousFrame={previousFrame}
      pathname="/"
    >
      <FrameImage options={frameImageOptions}>
        <div tw="w-full h-full bg-white text-[#2151f5] flex flex-col items-center justify-center text-7xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${HOST}/frames/success.png`}
            alt=""
            tw="absolute top-0 left-0 w-full"
          />
          <div tw="absolute left-[80px] w-[300px] top-[260px] text-center flex text-[50px] leading-[1.5] ">
            {countdown}
          </div>
          <div tw="absolute right-[60px] w-[300px] top-[270px] flex text-6xl text-center justify-center">
            {(state.numbers ?? finalUserData?.numbers ?? []).map((num) => (
              <div tw="flex flex-shrink-0 items-center mx-2" key={num}>
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
