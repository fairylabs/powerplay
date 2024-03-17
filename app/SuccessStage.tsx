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
import { getAddress } from "viem";
import {
  HOST,
  IS_DEBUG,
  Stage,
  State,
  getStorageKey,
  type MintData,
} from "./Frame";
import { CHAIN, PICK_AMOUNT } from "./config";
import { mintToken } from "./mintToken";

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
