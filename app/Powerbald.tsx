"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import Image from "next/image";
import Link from "next/link";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import ConnectButton from "./ConnectButton";
import "./Powerbald.css";
import { LOOTERY_ABI } from "./abi/Lootery";
import { CONTRACT_ADDRESS } from "./config";

import { UTCDate } from "@date-fns/utc";
import { endOfDay, formatDistance } from "date-fns";
import { Fragment, useState } from "react";
import { useInterval, useIsClient, useLocalStorage } from "usehooks-ts";

export function Powerbald() {
  const [useFilter, setUseFilter] = useLocalStorage("filter", true, {
    initializeWithValue: false,
  });
  const { data: gameId } = useReadContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "currentGameId",
  });

  const { data: gameData, isPending: isPendingGameState } = useReadContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "gameData",
    args: [gameId ?? 0n],
    query: {
      refetchInterval: 5000,
      enabled: gameId !== undefined,
    },
  });

  const lastGameId = gameId ? gameId - 1n : undefined;

  const { isConnected } = useAccount();

  return (
    <>
      {useFilter && (
        <svg width="0" height="0">
          <filter id="chroma">
            <feColorMatrix
              type="matrix"
              result="red_"
              values="4 0 0 0 0
              0 0 0 0 0 
              0 0 0 0 0 
              0 0 0 1 0"
            />
            <feOffset in="red_" dy="0" result="red">
              <animate
                attributeName="dx"
                //calcMode="discrete"
                values="0;0;2;0;2;0;0.5;0;0;2;0"
                dur="8s"
                repeatCount="indefinite"
              />
            </feOffset>
            <feColorMatrix
              type="matrix"
              in="SourceGraphic"
              result="blue_"
              values="0 0 0 0 0
              0 3 0 0 0 
              0 0 10 0 0 
              0 0 0 1 0"
            />
            <feOffset in="blue_" dx="-3" dy="0" result="blue">
              <animate
                attributeName="dx"
                //calcMode="discrete"
                values="0;0;-1;0;-1.5;0;-1;0;0;-2;0"
                dur="8s"
                repeatCount="indefinite"
              />
            </feOffset>
            <feBlend mode="screen" in="red" in2="blue" />
          </filter>
        </svg>
      )}

      <div className="flex flex-col text-white bg-[#2151f5] font-mono pt-8">
        {useFilter && (
          <div className="opacity-40 absolute z-10">
            <div className="lines pointer-events-none"></div>
          </div>
        )}
        <div style={{ filter: "url(#chroma)" }}>
          <div className="mx-auto font-black text-center space-y-10">
            <div className="bg-white py-4 px-8 mx-auto w-fit">
              <Image
                src="/logo.png"
                width={400}
                height={111}
                alt=""
                className="object-contain mx-auto"
              />
            </div>

            <Jackpot gameId={gameId} />
            <div className="space-y-2">
              <p className="text-base md:text-3xl">
                <Link
                  href="https://warpcast.com/lottopgf/0xa5237d47"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block cursor-pointer px-4 py-2 border-4 bg-white text-blue-800 font-black uppercase"
                >
                  Claim your free ticket now!
                </Link>
              </p>
              <p className="text-base md:text-xl">
                {isPendingGameState ? (
                  <>&nbsp;</>
                ) : (
                  <>
                    {Number(gameData?.[1] ?? 0n).toLocaleString("en-US")}{" "}
                    ALREADY CLAIMED TODAY
                  </>
                )}
              </p>
            </div>

            <hr className="border-2 max-w-32 mx-auto" />

            <div className="mx-auto border-4 w-full max-w-[460px] p-4 space-y-4">
              <p className="text-lg md:text-2xl">NEXT DRAWING IN</p>
              <Countdown />
              {isConnected ? (
                <>
                  <p className="text-lg md:text-2xl">YOUR NUMBERS TODAY</p>
                  <Tickets gameId={gameId} label="NONE YET" />
                </>
              ) : null}
            </div>

            <hr className="border-2 max-w-32 mx-auto" />

            <div>
              <p className="text-xl w-full max-w-[460px] pt-1 mx-auto bg-white text-blue-800 tracking-widest leading-none">
                YESTERDAYS DRAWING
              </p>
              <div className="mx-auto border-4 w-full max-w-[460px] p-4 space-y-4">
                <WinningNumbers gameId={lastGameId} />
                <hr className="border-2" />
                {isConnected ? (
                  <>
                    <p>YOUR NUMBERS</p>
                    <Tickets gameId={lastGameId} />
                    <ConnectButton />
                  </>
                ) : (
                  <>
                    <p className="uppercase">Connect to see your numbers</p>
                    <ConnectButton />
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            className="mx-auto my-8 block underline cursor-pointer hover:no-underline"
            onClick={() => setUseFilter(!useFilter)}
          >
            TOGGLE ANIMATIONS
          </button>

          <Link
            href="https://lottopgf.org"
            target="_blank"
            className="block relative w-full h-[400px] pt-5 overflow-hidden mt-[400px] cursor-pointer"
          >
            <div className="absolute -top-0 left-1/2 ml-2 -translate-x-1/2">
              <svg
                viewBox="0 0 500 300"
                className="mx-auto w-[400px] h-[200px]"
              >
                <path
                  id="curve"
                  d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
                  opacity={0}
                />
                <text width="500" fill="white">
                  <textPath xlinkHref="#curve" fontSize={24}>
                    Brought to you by LottoPGF &lt;3
                  </textPath>
                </text>
              </svg>
            </div>
            <Image
              src="/brian.webp"
              width={1000}
              height={1000}
              alt=""
              className="object-contain absolute top-12 left-1/2 -translate-x-1/2 max-w-none"
            />
          </Link>
        </div>
      </div>
    </>
  );
}

function Jackpot({ gameId }: { gameId: bigint | undefined }) {
  const { data: gameData } = useReadContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "gameData",
    args: [gameId ?? 0n],
    query: {
      enabled: gameId !== undefined,
    },
  });

  return (
    <div className="tabular-nums text-2xl md:text-7xl">
      YOUR CHANCE TO WIN{" "}
      <div>
        {parseInt(
          formatEther(gameData?.[0] ?? 1000000n * BigInt(1e18)),
        ).toLocaleString("en-US")}{" "}
        $DEGEN
      </div>
    </div>
  );
}

const winningNumbersQuery = gql`
  query winningPicks($gameId: BigInt) {
    gameFinaliseds(where: { gameId: $gameId }) {
      winningPicks
    }
  }
`;

function WinningNumbers({ gameId }: { gameId: bigint | undefined }) {
  const { numbers, isPending } = useWinningNumbers(gameId);

  const { data: winningPickIds } = useReadContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "winningPickIds",
    args: [gameId ?? 0n],
    query: {
      enabled: gameId !== undefined,
    },
  });

  const { data: winningTokenId } = useReadContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "tokenByPickIdentity",
    args: [gameId ?? 0n, winningPickIds ?? 0n, 0n],
    query: {
      enabled: gameId !== undefined && winningPickIds !== undefined,
    },
  });

  const { data: owner } = useReadContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "ownerOf",
    args: [winningTokenId ?? 0n],
    query: {
      enabled: winningTokenId !== undefined,
    },
  });

  if (gameId === undefined) {
    return (
      <div className="tabular-nums space-y-4">
        <div className="text-xl md:text-3xl">WINNING NUMBERS</div>
        <div className="flex justify-center gap-4 text-3xl md:text-6xl">
          SOON...
        </div>
      </div>
    );
  }

  if (isPending)
    return (
      <div className="tabular-nums space-y-4">
        <div className="text-xl md:text-3xl">WINNING NUMBERS</div>
        <div className="flex justify-center gap-4 text-3xl md:text-6xl">
          ...
        </div>
      </div>
    );

  if (!numbers) {
    return null;
  }

  return (
    <div className="tabular-nums space-y-4">
      <div className="text-xl md:text-3xl">WINNING NUMBERS</div>
      <div className="flex justify-center gap-4 text-3xl md:text-6xl">
        {numbers?.map((number) => <div key={number}>{number.toString()}</div>)}
      </div>
      {owner ? (
        <div className="space-y-2">
          <p className="text-3xl">WE HAVE A WINNER!!</p>
          <p>
            <Link href={`https://basescan.org/address/${owner}`}>{owner}</Link>
          </p>
        </div>
      ) : null}
    </div>
  );
}

const ticketsQuery = gql`
  query tickets($gameId: BigInt, $user: Bytes) {
    ticketPurchaseds(where: { gameId: $gameId, whomst: $user }) {
      tokenId
      picks
    }
  }
`;

function Tickets({
  gameId,
  label,
}: {
  gameId: bigint | undefined;
  label?: string;
}) {
  const { address } = useAccount();
  const { numbers } = useWinningNumbers(gameId);

  const { data, isPending } = useQuery<{
    ticketPurchaseds: { tokenId: bigint; picks: number[] }[];
  }>({
    queryKey: ["tickets", gameId?.toString()],
    queryFn: async () =>
      request(GRAPHQL_API, ticketsQuery, {
        gameId: gameId?.toString(),
        user: address?.toLowerCase(),
      }),
    enabled: useIsClient() && gameId !== undefined && address !== undefined,
  });

  if (isPending)
    return (
      <div className="tabular-nums">
        <div className="text-xl md:text-5xl">...</div>
      </div>
    );

  return (
    <div className="tabular-nums">
      <div className="space-y-4 text-xl md:text-5xl">
        {data?.ticketPurchaseds.length ? (
          data.ticketPurchaseds.map((ticket) => {
            const isWinner =
              !!ticket.picks && !!numbers && arraysEqual(ticket.picks, numbers);
            return (
              <Fragment key={ticket.tokenId}>
                <div className="flex justify-center gap-5">
                  {ticket.picks?.map((number) => (
                    <div key={number}>{number.toString()}</div>
                  ))}
                </div>
                {isWinner ? (
                  <div>
                    <p className="text-lg md:text-2xl">OMFG YOU WON!!1</p>
                    <ClaimButton ticketId={ticket.tokenId} />
                  </div>
                ) : null}
              </Fragment>
            );
          })
        ) : (
          <p className="text-xl md:text-5xl">{label ?? "NONE."}</p>
        )}
      </div>
    </div>
  );
}

const GRAPHQL_API =
  "https://api.studio.thegraph.com/query/7022/powerbaldv2/version/latest";

function useWinningNumbers(gameId: bigint | undefined) {
  const { data, ...rest } = useQuery<{
    gameFinaliseds: { winningPicks: number[] }[];
  }>({
    queryKey: ["winningNumbers", gameId?.toString()],
    queryFn: async () =>
      request(GRAPHQL_API, winningNumbersQuery, { gameId: gameId?.toString() }),
    enabled: useIsClient() && gameId !== undefined,
  });

  const numbers = data?.gameFinaliseds.at(0)?.winningPicks;

  return {
    ...rest,
    numbers,
    data,
  };
}

function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function ClaimButton({ ticketId }: { ticketId: bigint }) {
  const { writeContract, isPending } = useWriteContract();
  return (
    <button
      disabled={isPending}
      onClick={() => {
        try {
          return writeContract({
            abi: LOOTERY_ABI,
            address: CONTRACT_ADDRESS,
            functionName: "claimWinnings",
            args: [ticketId],
          });
        } catch (error) {
          console.error("Error claiming winnings", error);
        }
      }}
      className="text-lg md:text-3xl px-4 py-1 bg-white text-blue-800 uppercase"
    >
      Claim your prize
    </button>
  );
}

function Countdown() {
  const [countdown, setCountdown] = useState<string>();

  useInterval(() => {
    setCountdown(formatDistance(new UTCDate(), endOfDay(new UTCDate())));
  }, 1000);

  return (
    <div className="text-xl md:text-4xl uppercase">
      {countdown ? countdown : <>&nbsp;</>}
    </div>
  );
}
