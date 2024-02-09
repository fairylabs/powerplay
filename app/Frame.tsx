import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  getPreviousFrame,
  useFramesReducer,
  type PreviousFrame,
} from "frames.js/next/server";
import { MAXIMUM_NUMBER, PICK_AMOUNT } from "./config";
import { getRandomPicks } from "./utils/random";

enum Stage {
  INITIAL = "INITIAL",
  SELECTING_NUMBERS = "SELECTING_NUMBERS",
  SELECTING_NUMBERS_INVALID = "SELECTING_NUMBERS_INVALID",
  CONFIRMING_NUMBERS = "CONFIRMING_NUMBERS",
}

type State = {
  stage: Stage;
  numbers?: number[];
};

const initialState = {
  stage: Stage.SELECTING_NUMBERS,
};

function sanitizePicks(raw: string) {
  const splitNumbers = raw
    .split(/(?:,| )+/)
    .map((n) => parseInt(n.trim().replace(/\D/g, "")))
    .filter(Boolean);

  return new Set(
    splitNumbers.sort((a, b) => (a > b ? 1 : -1)),
  );
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
  console.log(state, action);

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
      const numbers = sanitizePicks(action.postBody.untrustedData.inputText);
      const valid = validatePicks(numbers);

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

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame,
  );

  if (
    state.stage === Stage.SELECTING_NUMBERS ||
    state.stage === Stage.SELECTING_NUMBERS_INVALID
  ) {
    return (
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        {state.stage === Stage.SELECTING_NUMBERS_INVALID ? (
          <FrameImage
            src={`/image/numbers?invalidNumbers=${state.numbers?.join(",")}`}
          />
        ) : (
          <FrameImage src="/image/numbers" />
        )}

        <FrameInput text="Type your numbers like 1 8 6 9" />
        <FrameButton onClick={dispatch}>Submit</FrameButton>
        <FrameButton onClick={dispatch}>Pick random numbers</FrameButton>
      </FrameContainer>
    );
  }

  if (state.stage === Stage.CONFIRMING_NUMBERS) {
    return (
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage
          src={`/image/numbers?selectedNumbers=${state.numbers?.join(",")}`}
        />
        <FrameButton onClick={dispatch}>Claim ticket</FrameButton>
        <FrameButton onClick={dispatch}>Pick new numbers</FrameButton>
      </FrameContainer>
    );
  }

  return (
    <FrameContainer
      postUrl="/frames"
      state={state}
      previousFrame={previousFrame}
    >
      <FrameImage src="/image" />
      <FrameButton onClick={dispatch}>Claim today&apos;s ticket</FrameButton>
    </FrameContainer>
  );
}
