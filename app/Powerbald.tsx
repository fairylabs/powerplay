"use client";

import Image from "next/image";
import "./Powerbald.css";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { LOOTERY_ABI } from "./abi/Lootery";
import { CONTRACT_ADDRESS } from "./config";
import { formatEther } from "viem";
import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import ConnectButton from "./ConnectButton";
import Link from "next/link";

import { useIsClient } from "usehooks-ts";
import { Fragment } from "react";

export function Powerbald() {
  const { data: gameId } = useReadContract({
    abi: LOOTERY_ABI,
    address: CONTRACT_ADDRESS,
    functionName: "currentGameId",
  });

  const lastGameId = gameId ? gameId - 1n : undefined;

  const { isConnected } = useAccount();

  return (
    <>
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

      <div className="flex flex-col text-white bg-[#2151f5] font-mono pt-8">
        <div className="opacity-40 absolute z-10">
          <div className="lines pointer-events-none"></div>
        </div>
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
            <p className="text-3xl">
              <Link
                href="https://warpcast.com/lottopgf/0xa5237d47"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block cursor-pointer px-4 py-2 border-4 bg-white text-blue-800 font-black uppercase"
              >
                Claim your free ticket now!
              </Link>
            </p>
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
                    <p>YOUR PICKS</p>
                    <Tickets gameId={lastGameId} />
                    <ConnectButton />
                  </>
                ) : (
                  <>
                    <p>Connect to see your picks</p>
                    <ConnectButton />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative w-full h-[400px] overflow-hidden mt-[400px]">
            <Image
              src="/brian.webp"
              width={1000}
              height={1000}
              alt=""
              className="object-contain absolute bottom-0 left-1/2 translate-y-[380px] -translate-x-1/2"
            />
          </div>
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
    <div className="tabular-nums  text-7xl">
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

  if (gameId === undefined) {
    return (
      <div className="tabular-nums space-y-4">
        <div className="text-3xl">WINNING NUMBERS</div>
        <div className="flex justify-center gap-4 text-6xl">SOON...</div>
      </div>
    );
  }

  if (isPending)
    return (
      <div className="tabular-nums space-y-4">
        <div className="text-3xl">WINNING NUMBERS</div>
        <div className="flex justify-center gap-4 text-6xl">...</div>
      </div>
    );

  if (!numbers) {
    return null;
  }

  return (
    <div className="tabular-nums space-y-4">
      <div className="text-3xl">WINNING NUMBERS</div>
      <div className="flex justify-center gap-4 text-6xl">
        {numbers?.map((number) => <div key={number}>{number.toString()}</div>)}
      </div>
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

function Tickets({ gameId }: { gameId: bigint | undefined }) {
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
        <div className="text-5xl">...</div>
      </div>
    );

  return (
    <div className="tabular-nums">
      <div className="space-y-4 text-5xl">
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
                    <p className="text-2xl">OMFG YOU WON!!1</p>
                    <ClaimButton ticketId={ticket.tokenId} />
                  </div>
                ) : null}
              </Fragment>
            );
          })
        ) : (
          <p className="text-6xl">NONE.</p>
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
      className="text-3xl px-4 py-1 bg-white text-blue-800 uppercase"
    >
      Claim your prize
    </button>
  );
}
