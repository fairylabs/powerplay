"use client";

import Image from "next/image";
import "./Powerbald.css";

export function Powerbald() {
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
              calcMode="discrete"
              values="0;0;3;0;3;0;1;0;0;2;0"
              dur="4s"
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
              calcMode="discrete"
              values="0;0;-5;0;-5;0;-2;0;0;-3;0"
              dur="s"
              repeatCount="indefinite"
            />
          </feOffset>
          <feBlend mode="screen" in="red" in2="blue" />
        </filter>
      </svg>

      <div className="flex text-white bg-[#2151f5] min-h-[100dvh] font-mono">
        <div className="opacity-50 absolute z-10">
          <div className="lines"></div>
        </div>

        <div
          className="absolute left-4 top-4 font-bold text-4xl"
          style={{ filter: "url(#chroma)" }}
        >
          LIVE TV
        </div>
        <div
          className="m-auto text-8xl font-black"
          style={{ filter: "url(#chroma)" }}
        >
          <Image
            src="/logo.png"
            width={600}
            height={200}
            alt=""
            className="object-contain"
          />
        </div>
        <Image
          src="/brian.webp"
          width={1000}
          height={1000}
          alt=""
          className="object-contain absolute bottom-0 left-1/2 translate-y-[550px] -translate-x-1/2"
          style={{ filter: "url(#chroma)" }}
        />
      </div>
    </>
  );
}
