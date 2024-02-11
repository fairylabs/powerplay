"use client";

import "./Powerbald.css";

export function Powerbald() {
  return (
    <div id="container">
      <h1 id="gm">Balding soon</h1>
      <a
        id="meme"
        target="_blank"
        onDoubleClick={() => {
          window
            .open("https://www.youtube.com/watch?v=xWSxmyW7oLw", "_blank")
            ?.focus();
        }}
        onTouchEnd={(e) => {
          if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent,
            )
          ) {
            detectDoubleTapClosure()(e);
          }
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img id="brian" src="/brian.webp" alt="Brian" />
      </a>
    </div>
  );
}

function detectDoubleTapClosure() {
  let lastTap = 0;
  let timeout: NodeJS.Timeout;
  return function detectDoubleTap(event: React.TouchEvent<HTMLAnchorElement>) {
    const curTime = new Date().getTime();
    const tapLen = curTime - lastTap;
    if (tapLen < 500 && tapLen > 0) {
      window
        .open("https://www.youtube.com/watch?v=xWSxmyW7oLw", "_blank")
        ?.focus();
      event.preventDefault();
    } else {
      timeout = setTimeout(() => {
        clearTimeout(timeout);
      }, 500);
    }
    lastTap = curTime;
  };
}
