import { kv } from "@vercel/kv";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
  type PreviousFrame,
} from "frames.js/next/server";
import { readFile } from "fs/promises";
import path from "path";
import type { SatoriOptions } from "satori";
import { publicActions, type Hex } from "viem";
import { NeynarAPI } from "../api/neynar-api";
import { SuccessStage } from "./SuccessStage";
import {
  CHAIN,
  CONTRACT_ADDRESS,
  LOTTO_ACCOUNT_FID,
  MAXIMUM_NUMBER,
  PICK_AMOUNT,
  publicClient,
} from "./config";
import { DEBUG_HUB_OPTIONS } from "./debug/constants";
import { getRandomPicks } from "./utils/random";
import { LOOTERY_ABI } from "./abi/Lootery";
import { baseSepolia } from "viem/chains";

const IS_DEBUG = process.env.ENABLE_DEBUG === "true";

const neynar = new NeynarAPI();

export enum Stage {
  INITIAL = "INITIAL",
  SELECTING_NUMBERS = "SELECTING_NUMBERS",
  SELECTING_NUMBERS_INVALID = "SELECTING_NUMBERS_INVALID",
  CONFIRMING_NUMBERS = "CONFIRMING_NUMBERS",
  SUCCESS = "SUCCESS",
}

export type State = {
  stage: Stage;
  numbers?: number[];
};

export type MintData = {
  fid: number;
  hash: Hex;
  timestamp: string;
  numbers: number[];
};

const initialState: State = {
  stage: Stage.INITIAL,
};

export function getStorageKey(gameId: number, fid: number) {
  if ((CHAIN.id as number) === baseSepolia.id) {
    return `powerbald-testnet:${gameId}:${fid}`;
  }

  return `powerbald:${gameId}:${fid}`;
}

function sanitizePicks(raw: string) {
  const splitNumbers = raw
    .split(/(?:,| )+/)
    .map((n) => parseInt(n.trim().replace(/\D/g, "")))
    .filter(Boolean);

  return new Set(splitNumbers.sort((a, b) => (a > b ? 1 : -1)));
}

function validatePicks(picks: Set<number>) {
  if (picks.size !== PICK_AMOUNT) {
    return false;
  }

  for (const pick of picks) {
    if (pick < 1 || pick > MAXIMUM_NUMBER) {
      return false;
    }
  }

  return true;
}

// @ts-ignore
const reducer: FrameReducer<State> = (state, action: PreviousFrame<State>) => {
  // INITIAL -> SELECTING_NUMBERS
  if (
    state.stage === Stage.INITIAL &&
    action.postBody?.untrustedData.buttonIndex === 1
  ) {
    return {
      ...state,
      stage: Stage.SELECTING_NUMBERS,
    };
  }

  // SELECTING_NUMBERS -> CONFIRMING_NUMBERS or SELECTING_NUMBERS_INVALID
  if (
    state.stage === Stage.SELECTING_NUMBERS ||
    state.stage === Stage.SELECTING_NUMBERS_INVALID
  ) {
    if (action.postBody?.untrustedData.buttonIndex === 2) {
      return {
        ...state,
        numbers: Array.from(getRandomPicks(PICK_AMOUNT, MAXIMUM_NUMBER)),
        stage: Stage.CONFIRMING_NUMBERS,
      };
    }

    if (action.postBody?.untrustedData.buttonIndex === 1) {
      const numbers = sanitizePicks(
        action.postBody.untrustedData.inputText ?? "",
      );
      const valid = validatePicks(numbers);

      console.log(valid);

      if (!numbers.size) {
        return {
          ...state,
          stage: Stage.SELECTING_NUMBERS,
          numbers: undefined,
        };
      }

      return {
        ...state,
        stage: valid
          ? Stage.CONFIRMING_NUMBERS
          : Stage.SELECTING_NUMBERS_INVALID,
        numbers: Array.from(numbers),
      };
    }

    return {
      ...state,
      stage: Stage.SELECTING_NUMBERS,
    };
  }

  // CONFIRMING_NUMBERS -> SELECTING_NUMBERS or CLAIMING
  if (state.stage === Stage.CONFIRMING_NUMBERS) {
    if (action.postBody?.untrustedData.buttonIndex === 1) {
      // Do claim stuff
      return {
        ...state,
        stage: Stage.SUCCESS,
      };
    }

    if (action.postBody?.untrustedData.buttonIndex === 2) {
      return {
        ...state,
        numbers: undefined,
        stage: Stage.SELECTING_NUMBERS,
      };
    }
  }

  return state;
};

export async function Frame({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const previousFrame = getPreviousFrame<State>(searchParams);
  const frameImageOptions: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Comic Helvetic",
        data: await readFile(
          path.resolve(process.cwd(), "./fonts/ComicHelvetic_Medium.otf"),
        ),
        weight: 300,
        style: "normal",
      },
    ],
  };

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...(!IS_DEBUG ? {} : DEBUG_HUB_OPTIONS),
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  try {
    const rawGameId = await publicClient.readContract({
      abi: LOOTERY_ABI,
      address: CONTRACT_ADDRESS,
      functionName: "currentGameId",
    });

    const gameId = Number(rawGameId);

    const userData =
      state.stage !== Stage.INITIAL && frameMessage?.requesterFid
        ? await kv.hgetall<MintData>(
            getStorageKey(gameId, frameMessage.requesterFid),
          )
        : null;
    const hasClaimedTodaysTicket = !!userData;

    if (state.stage === Stage.SUCCESS || hasClaimedTodaysTicket) {
      return (
        <SuccessStage
          gameId={gameId}
          userData={userData}
          frameImageOptions={frameImageOptions}
          previousFrame={previousFrame}
          state={state}
          frameMessage={frameMessage}
        />
      );
    }

    if (
      state.stage === Stage.SELECTING_NUMBERS ||
      state.stage === Stage.SELECTING_NUMBERS_INVALID
    ) {
      const [userDataResponse, isDegenResponse] = frameMessage?.requesterFid
        ? await Promise.allSettled([
            neynar.user
              .userBulk(
                frameMessage.requesterFid.toString(),
                process.env.NEYNAR_API_KEY,
                LOTTO_ACCOUNT_FID,
              )
              .then((f) => f.users.at(0) ?? null),
            checkIsDegen(frameMessage.requesterFid),
          ])
        : [];

      const isFollowing = IS_DEBUG
        ? true
        : userDataResponse?.status === "fulfilled" &&
          userDataResponse.value?.viewer_context?.followed_by;
      const hasLiked = IS_DEBUG ? true : frameMessage?.likedCast;
      const isActive =
        userDataResponse?.status === "fulfilled" &&
        userDataResponse.value?.active_status === "active";
      const isDegen =
        isDegenResponse?.status === "fulfilled" && isDegenResponse.value;

      if (!isFollowing || !hasLiked) {
        return (
          <FrameContainer
            postUrl="/frames"
            state={state}
            previousFrame={previousFrame}
            pathname="/"
          >
            <FrameImage src="/frames/follow.png" />
            <FrameButton action="post">Try again</FrameButton>
            <FrameButton action="link" target="https://warpcast.com/lottopgf">
              Follow @lottopgf
            </FrameButton>
          </FrameContainer>
        );
      }

      console.log(frameMessage?.requesterFid, isDegen, isActive);

      if (!isActive && !isDegen) {
        return (
          <FrameContainer
            postUrl="/frames"
            state={state}
            previousFrame={previousFrame}
            pathname="/"
          >
            <FrameImage src="/frames/no-allowance.png" />
            <FrameButton>Try again</FrameButton>
            <FrameButton
              action="link"
              target="https://warpcast.com/~/channel/lotto"
            >
              Visit /lotto for news
            </FrameButton>
          </FrameContainer>
        );
      }

      return (
        <FrameContainer
          postUrl="/frames"
          state={state}
          previousFrame={previousFrame}
          pathname="/"
        >
          {state.stage === Stage.SELECTING_NUMBERS_INVALID ? (
            <FrameImage src="/frames/numbers_invalid.png" />
          ) : (
            <FrameImage src="/frames/pick.png" />
          )}
          <FrameInput text="Type your numbers like 1 2 7 19 25" />
          <FrameButton>Submit your numbers 🍀</FrameButton>
          <FrameButton>Pick random 🔮</FrameButton>
        </FrameContainer>
      );
    }

    if (state.stage === Stage.CONFIRMING_NUMBERS) {
      return (
        <FrameContainer
          postUrl="/frames"
          state={state}
          previousFrame={previousFrame}
          pathname="/"
        >
          <FrameImage options={frameImageOptions}>
            <div tw="w-full h-full bg-[#2151f5] text-white flex flex-col items-center justify-center font-mono text-7xl leading-[2] text-center">
              <span>You&apos;ve picked</span>
              <div tw="flex text-8xl my-10">
                {state.numbers?.map((num) => (
                  <div
                    tw="flex flex-shrink-0 0 items-center justify-center w-40 h-40 border-white border-4 rounded-full mx-5 pt-4"
                    key={num}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <span>Claim your ticket</span>
              <span>or try again</span>
            </div>
          </FrameImage>
          <FrameButton>Claim ticket ✅</FrameButton>
          <FrameButton>Pick new numbers 🔄</FrameButton>
        </FrameContainer>
      );
    }

    return (
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
        pathname="/"
      >
        <FrameImage src="/frames/initial.png" />
        <FrameButton>🔵 🎰 🌟 Claim free ticket 🌟 🎰 🔵</FrameButton>
      </FrameContainer>
    );
  } catch (e) {
    e instanceof Error && console.error(e.message);
    return (
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
        pathname="/"
      >
        <FrameImage src="/frames/error.png" />
        <FrameButton>Try again</FrameButton>
        <FrameButton
          action="link"
          target="https://warpcast.com/~/channel/lotto"
        >
          Visit /lotto for news
        </FrameButton>
      </FrameContainer>
    );
  }
}

export interface AllowanceUser {
  fid: string;
  user_rank: string;
  avatar_url: string;
  display_name: string;
  reactions_per_cast: string;
  tip_allowance: string;
}

async function checkIsDegen(fid: number): Promise<boolean> {
  const url = new URL("https://www.degen.tips/api/airdrop2/tip_allowances");

  // 4s timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 4000);

  const response: AllowanceUser[] = await fetch(url, {
    next: {
      revalidate: 3600,
    },
    signal: controller.signal,
  }).then((res) => res.json());

  clearTimeout(id);

  return response.some((user) => user.fid === fid.toString());
}
