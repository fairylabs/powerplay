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
import { NeynarAPI } from "../api/neynar-api";
import { LOTTO_ACCOUNT_FID, MAXIMUM_NUMBER, PICK_AMOUNT } from "./config";
import { DEBUG_HUB_OPTIONS } from "./debug/constants";
import { getRandomPicks } from "./utils/random";

const IS_PRODUCTION = process.env.DISABLE_DEBUG !== "true";

const neynar = new NeynarAPI();

enum Stage {
  INITIAL = "INITIAL",
  SELECTING_NUMBERS = "SELECTING_NUMBERS",
  SELECTING_NUMBERS_INVALID = "SELECTING_NUMBERS_INVALID",
  CONFIRMING_NUMBERS = "CONFIRMING_NUMBERS",
  SUCCESS = "SUCCESS",
}

type State = {
  stage: Stage;
  numbers?: number[];
};

const initialState: State = {
  stage: Stage.INITIAL,
};

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

      return {
        ...state,
        stage:
          !numbers || valid
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
    ...(IS_PRODUCTION ? {} : DEBUG_HUB_OPTIONS),
  });

  if (frameMessage && !frameMessage?.isValid) {
    throw new Error("Invalid frame payload");
  }

  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  const hasClaimedTodaysTicket = false; // @TODO get from contract
  const alreadyPickedNumbers = [1, 2, 3, 4, 5]; // @TODO get from contract

  if (state.stage === Stage.SUCCESS || hasClaimedTodaysTicket) {
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
              {(state.numbers ?? alreadyPickedNumbers).map((num) => (
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
        <FrameButton action="link" target="https://basescan.org">
          TX
        </FrameButton>
      </FrameContainer>
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

    const isFollowing =
      userDataResponse?.status === "fulfilled" &&
      userDataResponse.value?.viewer_context?.followed_by;
    const isActive =
      userDataResponse?.status === "fulfilled" &&
      userDataResponse.value?.active_status === "active";
    const isDegen =
      isDegenResponse?.status === "fulfilled" && isDegenResponse.value;

    if (!isFollowing) {
      return (
        <FrameContainer
          postUrl="/frames"
          state={state}
          previousFrame={previousFrame}
          pathname="/"
        >
          <FrameImage options={frameImageOptions}>
            <div tw="w-full h-full bg-[#2151f5] text-white flex flex-col items-center justify-center text-center text-7xl">
              <div tw="text-7xl leading-[1.5]">
                Follow @LottoPGF to claim your ticket!
              </div>
            </div>
          </FrameImage>
          <FrameButton action="link" target="https://warpcast.com/lottopgf">
            Follow @LottoPGF
          </FrameButton>
        </FrameContainer>
      );
    }

    if (!isActive && !isDegen) {
      return (
        <FrameContainer
          postUrl="/frames"
          state={state}
          previousFrame={previousFrame}
          pathname="/"
        >
          <FrameImage options={frameImageOptions}>
            <div tw="w-full h-full bg-[#2151f5] text-white flex flex-col items-center justify-center text-center text-7xl p-10">
              <div tw="mb-10">Can&apos;t claim today :(</div>
              <div tw="text-7xl leading-[1.5]">
                You need $DEGEN allowance or active status on Farcaster to claim
                your ticket!
              </div>
            </div>
          </FrameImage>
          <FrameButton>Try again</FrameButton>
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
        <FrameImage options={frameImageOptions}>
          <div tw="w-full h-full bg-[#2151f5] text-white flex flex-col items-center justify-center text-7xl leading-[1.5]">
            <span>Hi {frameMessage?.requesterUserData?.displayName}!</span>
            {state.stage === Stage.SELECTING_NUMBERS_INVALID ? (
              <div tw="text-red-500 font-bold mb-5">Invalid!</div>
            ) : null}
            <span>Please pick {PICK_AMOUNT} unique numbers</span>
            <span tw="flex">between 1 and {MAXIMUM_NUMBER}</span>
          </div>
        </FrameImage>

        <FrameInput text="Type your numbers like 1 2 7 19 25" />
        <FrameButton>Submit</FrameButton>
        <FrameButton>Pick random numbers</FrameButton>
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
        <FrameButton>Claim ticket</FrameButton>
        <FrameButton>Pick new numbers</FrameButton>
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
      <FrameImage options={frameImageOptions}>
        <div tw="w-full h-full bg-[#2151f5] text-white flex flex-col items-center justify-center font-mono text-9xl">
          Powerbald 🎱
        </div>
      </FrameImage>
      <FrameButton>Claim your free ticket</FrameButton>
    </FrameContainer>
  );
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
