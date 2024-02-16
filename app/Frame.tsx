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
import { type Hex } from "viem";
import { baseSepolia } from "viem/chains";
import { NeynarAPI } from "../api/neynar-api";
import { SuccessStage } from "./SuccessStage";
import { LOOTERY_ABI } from "./abi/Lootery";
import {
  CHAIN,
  CONTRACT_ADDRESS,
  FOLLOW_ACCOUNT_FID,
  FOLLOW_ACCOUNT_USERNAME,
  MAXIMUM_NUMBER,
  PICK_AMOUNT,
  publicClient,
} from "./config";
import { DEBUG_HUB_OPTIONS } from "./debug/constants";
import { getRandomPicks } from "./utils/random";

export const IS_DEBUG = process.env.ENABLE_DEBUG === "true";

export const HOST = process.env.NEXT_PUBLIC_HOST;

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
      const input = action.postBody.untrustedData.inputText ?? "";
      const numbers = sanitizePicks(input);
      const valid = validatePicks(numbers);

      !valid && console.info("INVALID PICKS", input, numbers);

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
    width: 600,
    height: 314,
    debug: IS_DEBUG,
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
    const rawGameId =
      state.stage === Stage.INITIAL
        ? 0
        : await publicClient.readContract({
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
      const userData = frameMessage?.requesterFid
        ? await neynar.user
            .userBulk(
              frameMessage.requesterFid.toString(),
              process.env.NEYNAR_API_KEY,
              FOLLOW_ACCOUNT_FID,
            )
            .then((f) => f.users.at(0) ?? null)
        : null;

      const isFollowing = IS_DEBUG
        ? true
        : userData?.viewer_context?.followed_by ?? false;
      const hasLiked = IS_DEBUG ? true : frameMessage?.likedCast;
      const isActive = userData?.active_status === "active";
      const isDegen = userData
        ? await checkIsDegen(userData.verifications)
        : false;

      if (!isFollowing /* || !hasLiked*/) {
        return (
          <FrameContainer
            postUrl="/frames"
            state={state}
            previousFrame={previousFrame}
            pathname="/"
          >
            <FrameImage src={`${HOST}/frames/follow.png`} />
            <FrameButton action="post">Try again</FrameButton>
            <FrameButton
              action="link"
              target={`https://warpcast.com/${FOLLOW_ACCOUNT_USERNAME}`}
            >
              {`Follow @${FOLLOW_ACCOUNT_USERNAME}`}
            </FrameButton>
          </FrameContainer>
        );
      }

      if (!isActive && !isDegen) {
        console.info("NO ALLOWANCE", userData?.username, userData?.fid);
        return (
          <FrameContainer
            postUrl="/frames"
            state={state}
            previousFrame={previousFrame}
            pathname="/"
          >
            <FrameImage src={`${HOST}/frames/no-allowance.png`} />
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
            <FrameImage src={`${HOST}/frames/numbers_invalid.png`} />
          ) : (
            <FrameImage src={`${HOST}/frames/pick.png`} />
          )}
          <FrameInput text="Your numbers like 1 2 7 19 25" />
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
            <div tw="w-full h-full bg-white text-[#2151f5] flex flex-col items-center justify-center font-mono text-7xl leading-[2] text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${HOST}/frames/numbers.png`}
                alt=""
                tw="absolute top-0 left-0 w-full"
              />
              <div tw="absolute w-full bottom-[17%] flex text-[40px] left-[1.2%]">
                {state.numbers?.map((num) => (
                  <div
                    tw="flex flex-shrink-0 0 items-center justify-center w-[13%] rounded-full mx-[3.105%] text-center"
                    key={num}
                  >
                    {num}
                  </div>
                ))}
              </div>
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
        <FrameImage src={`${HOST}/frames/initial.gif?c=punkape`} />
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
        <FrameImage src={`${HOST}/frames/error.png`} />
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

async function checkIsDegen(addresses: string[]): Promise<boolean> {
  const results = await Promise.allSettled(
    addresses.map((address) => getDegenAllowance(address)),
  );

  return results.some(
    (result) => result.status === "fulfilled" && result.value.length > 0,
  );
}

async function getDegenAllowance(address: string): Promise<AllowanceUser[]> {
  const url = new URL("https://www.degen.tips/api/airdrop2/tip-allowance");
  url.searchParams.set("address", address.toLowerCase());

  // 3s timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3000);

  const response = await fetch(url, {
    next: {
      revalidate: 3600,
    },
    signal: controller.signal,
  }).then((res) => res.json());

  clearTimeout(id);

  return response;
}
