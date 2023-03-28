import React from "react";
import { ScrollingAnimationProps, IterationType } from "@/types";
import useScrollingAnimation from "@renderer/hooks/useScrollingAnimation";

interface SongArtistsProps {
  artistNames: string;
  animationProps?: ScrollingAnimationProps;
}

export default function SongArtists(props: SongArtistsProps) {
  const {
    artistNames,
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

  const renderArtist = React.useCallback((artist: string, index: number) => {
    return (
      <span
        className="text-sm text-gray-800 dark:text-gray-200 font-normal truncate cursor-default hover:underline"
        key={index}
      >
        {artist}
      </span>
    );
  }, []);

  const renderArtists = React.useCallback(
    (artists: string[]) => {
      const artistsRendered = artists.map(renderArtist);

      const output: JSX.Element[] = [];

      artistsRendered.forEach((artist, index) => {
        output.push(artist);
        if (index < artistsRendered.length - 1) {
          output.push(
            <span
              className="text-sm text-gray-800 dark:text-gray-200 font-normal truncate cursor-default"
              key={`comma-${index}`}
            >
              ,&nbsp;
            </span>
          );
        }
      });

      return output;
    },
    [renderArtist]
  );

  const renderedArtists = React.useMemo(() => renderArtists(artistNames.split(",")), [artistNames, renderArtists]);
  return (
    <div
      className="w-full min-w-0"
      style={{
        gridArea: "subtitle",
        gridColumnStart: "badges",
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
          maskImage: "linear-gradient(90deg, transparent 0, black 6px, black calc(100% - 12px), transparent )",
          // eslint-disable-next-line @typescript-eslint/naming-convention
          WebkitMaskImage: "linear-gradient(90deg, transparent 0, black 6px, black calc(100% - 12px), transparent )",
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
            {renderedArtists}
          </div>
        </div>
      </div>
    </div>
  );
}
