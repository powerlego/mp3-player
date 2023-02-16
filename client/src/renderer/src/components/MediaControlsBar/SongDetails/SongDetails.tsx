import { ScrollingAnimationProps } from "@/types";
import React from "react";
import { BsChevronUp } from "react-icons/bs";
import SongArtists from "./SongArtists/SongArtists";
import SongName from "./SongName";

interface SongDetailsProps {
  songName: string;
  artistName: string;
  coverArt: string;
  expandFunc?: () => void;
  animationProps?: ScrollingAnimationProps;
}

function SongDetails(props: SongDetailsProps) {
  const { songName, artistName, coverArt, expandFunc, animationProps } = props;

  const [expanded, setExpanded] = React.useState(false);

  const onExpandClick = React.useCallback(() => {
    if (!expandFunc) {
      return;
    }
    expandFunc();
    setExpanded(!expanded);
  }, [expandFunc, expanded]);
  return (
    <div className="m-0 flex flex-row items-center h-full w-[30%] min-w-[11.25rem]">
      {coverArt === "" ? (
        <></>
      ) : (
        <div className={`relative h-4/5 aspect-square group/parent ${expanded ? "scale-0" : ""}`}>
          <div className="absolute right-0 top-0 scale-0 group/tooltip group-hover/parent:scale-100">
            <div
              className="absolute right-0 top-0 object-cover rounded-full bg-opacity-75 dark:bg-opacity-75 bg-gray-350 dark:bg-black
  w-5 h-5 m-0.5 flex items-center justify-center hover:h-6 hover:w-6"
              onClick={onExpandClick}
            >
              <BsChevronUp className="fill-gray-800 dark:fill-gray-200 h-[90%] w-[90%] m-0 opacity-100 stroke-gray-800 dark:stroke-gray-200 hover:stroke-1" />
            </div>
          </div>
          <img alt="Cover Art" className={`h-full w-full ${expanded ? "scale-0" : ""}`} src={coverArt} />
        </div>
      )}
      <div
        className={`items-center grid gap-x-2 mx-4 ${expanded ? "-translate-x-20" : ""}`}
        style={{
          gridTemplate: "'title title' 'badges subtitle' / auto 1fr",
        }}
      >
        <SongName animationProps={animationProps} songName={songName} />
        <SongArtists animationProps={animationProps} artistNames={artistName} />
      </div>
    </div>
  );
}

export default SongDetails;
