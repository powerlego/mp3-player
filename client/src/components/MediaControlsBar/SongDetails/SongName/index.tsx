import React from "react";
import { IterationType, ScrollingAnimationProps } from "../../../../types";
import useScrollingAnimation from "../../../../hooks/useScrollingAnimation";
import "./SongName.css";

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
      className="song-details-name-align"
      onBlur={handleMouseOut}
      onFocus={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
    >
      <div className="song-details-name-container" ref={containerRef}>
        <div className="overflow-hidden">
          <div className="song-details-name-offset" ref={offsetRef}>
            <span className="song-details-name">{songName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
