import {
  FrameButton,
  FrameContainer,
  FrameImage,
  type PreviousFrame,
} from "frames.js/next/server";
import type { SatoriOptions } from "satori";
import { State, type MintData, Stage, getStorageKey } from "./Frame";
import { kv } from "@vercel/kv";
import type { FrameActionDataParsedAndHubContext } from "frames.js";
import { PICK_AMOUNT } from "./config";

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
      // @TODO Mint stuff
      const hash = "0x123";
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
        target={`https://basescan.org/tx/${finalUserData?.hash}`}
      >
        TX
      </FrameButton>
    </FrameContainer>
  );
}
