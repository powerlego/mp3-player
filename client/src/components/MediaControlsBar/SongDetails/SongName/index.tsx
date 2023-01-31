import React from "react";
import { IterationType, ScrollingAnimationProps } from "../../../../types";
import useScrollingAnimation from "../../../../hooks/useScrollingAnimation";

interface SongNameProps {
  songName: string;
  animationProps?: ScrollingAnimationProps;
}

export default function SongName(props: SongNameProps) {
  const {
    songName,
    animationProps = {
      speed: 0.2,
      pauseAtEndEdgeDurationMs: 1200,
      initialMouseIntDelayMs: 200,
      iterationType: IterationType.single,
    },
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const offsetRef = React.useRef<HTMLDivElement>(null);
  const [handleMouseOver, handleMouseOut] = useScrollingAnimation({ containerRef, offsetRef, animationProps });

  return (
    <div
      className="w-full justify-self-start"
      style={{
        gridArea: "title",
      }}
      onBlur={handleMouseOut}
      onFocus={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
    >
      <div
        ref={containerRef}
        style={{
          marginLeft: "-6px",
          marginRight: "-6px",
          overflow: "hidden",
          position: "relative",
          maskImage: "linear-gradient(90deg, transparent 0, black 6px, black calc(100% - 12px), transparent)",
        }}
      >
        <div className="overflow-hidden">
          <div
            ref={offsetRef}
            style={{
              display: "flex",
              paddingInlineStart: "6px",
              paddingInlineEnd: "12px",
              transform: "translateX(var(--trans-x))",
              whiteSpace: "nowrap",
              width: "fit-content",
            }}
          >
            <span className="text-base text-gray-800 dark:text-gray-200 font-semibold cursor-default">{songName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
