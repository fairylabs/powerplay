import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { MAXIMUM_NUMBER, PICK_AMOUNT } from "../../config";

// Route segment config
export const runtime = "edge";

// Image metadata
const size = {
  width: 1200,
  height: 630,
};

// Image generation
export async function GET(req: NextRequest) {
  const invalidNumbers = req.nextUrl.searchParams.get("invalidNumbers");
  const selectedNumbers = req.nextUrl.searchParams.get("selectedNumbers");

  if (selectedNumbers) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            background: "#2151f5",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: "monospace",
            textTransform: "uppercase",
          }}
        >
          <p>You&apos;ve picked</p>
          <p>{selectedNumbers.split(",").join(" ")}</p>
          <p>Claim your ticket or pick again</p>
        </div>
      ),
      {
        emoji: "twemoji",
        ...size,
      },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "#2151f5",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "monospace",
          textTransform: "uppercase",
        }}
      >
        {!!invalidNumbers && <p>Invalid!</p>}
        <p>Please pick {PICK_AMOUNT} unique numbers</p>
        <p>between 1 and {MAXIMUM_NUMBER}</p>
      </div>
    ),
    {
      emoji: "twemoji",
      ...size,
    },
  );
}
