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
import {
  HOST,
  Stage,
  State,
  getStorageKey,
  type MintData,
  IS_DEBUG,
} from "./Frame";
import { LOOTERY_ABI } from "./abi/Lootery";
import {
  BONUS_ROUND,
  CHAIN,
  CONTRACT_ADDRESS,
  MAXIMUM_NUMBER,
  MINTER_PRIVATE_KEY,
  PICK_AMOUNT,
  publicClient,
  walletClient,
} from "./config";
import { getRandomPicks } from "./utils/random";

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

      console.info(
        "NEW MINT",
        frameMessage.requesterUserData?.username,
        state.numbers,
        data,
      );
      finalUserData = data;
    }
  }

  const countdown = formatDistance(new UTCDate(), endOfDay(new UTCDate()));

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
          <div tw="absolute left-[7%] w-[25%] top-[41%] text-center flex text-[25px] leading-[1.5] ">
            {countdown}
          </div>
          <div tw="absolute right-[0.5%] w-[33%] top-[42%] flex text-[26px] text-center leading-[1.5] justify-center">
            {(
              state.numbers ??
              finalUserData?.numbers ?? ["?", "?", "?", "?", "?"]
            ).map((num) => (
              <div tw="flex flex-shrink-0 items-center mx-[3.3%]" key={num}>
                {num}
              </div>
            ))}
          </div>
        </div>
      </FrameImage>
      {IS_DEBUG ? <FrameButton action="post">Retry</FrameButton> : null}
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
  const bonusPicks1 = Array.from(getRandomPicks(PICK_AMOUNT, MAXIMUM_NUMBER));
  const bonusPicks2 = Array.from(getRandomPicks(PICK_AMOUNT, MAXIMUM_NUMBER));

  const gameId = await publicClient.readContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "currentGameId",
  });

  const isBonusRound = gameId === BONUS_ROUND;

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
    account: privateKeyToAccount(MINTER_PRIVATE_KEY),
  });

  if (!request) {
    throw new Error("Could not simulate contract");
  }

  try {
    if (IS_DEBUG) {
      throw new Error("DEBUGGING", { cause: request });
      return null;
    }

    const hash = await walletClient.writeContract(request);
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
