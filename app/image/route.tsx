import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
const size = {
  width: 1200,
  height: 630,
};

// Image generation
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "#2151f5",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          textTransform: "uppercase",
        }}
      >
        Powerbald 🎱
      </div>
    ),
    // ImageResponse options
    {
      emoji: "twemoji",
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    },
  );
}
