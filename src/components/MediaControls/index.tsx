import React from "react";
import { useState } from "react";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { BiShuffle } from "react-icons/bi";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
import "./MediaControls.css";

function MediaControlsBar() {
  return (
    <footer className="media-controls">
      <div className="m-0 flex h-full w-56 bg-gray-200"></div>
      <div className="media-controls__center">
        <div className="media-controls__controls">
          <ShuffleButton />
          <SkipBackButton />
          <PlayButton />
          <SkipForwardButton />
          <RepeatButton />
        </div>
        <TrackProgress />
      </div>
      <div className="m-0 flex h-full w-56 bg-gray-200">
        <div className="media-controls__mute" />
        <div className="media-controls__volume"></div>
      </div>
    </footer>
  );
}

function TrackProgress() {
  return (
    <div className="media-controls__progress">
      <div className="media-controls__progress__time"> 99:99 </div>
      <ProgressBar percentage={50} />
      <div className="media-controls__progress__time"> 99:99 </div>
    </div>
  );
}

type ProgressBarProps = {
  percentage: number;
};

function ProgressBar({ percentage }: ProgressBarProps) {
  const fillerStyle = {
    width: `${percentage}%`,
  };

  return (
    <div className="media-controls__progress__bar group">
      <div
        className="media-controls__progress__bar__progress flex items-center justify-end group-hover:bg-green-500 dark:group-hover:bg-green-500"
        style={fillerStyle}
      >
        <div className="media-controls__progress__bar__scrubber group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250" />
      </div>
    </div>
  );
}

function ShuffleButton() {
  const [isShuffle, setIsShuffle] = useState(false);
  const handleShuffle = () => setIsShuffle(!isShuffle);
  return (
    <div onClick={() => handleShuffle()}>
      {isShuffle ? (
        <BiShuffle className="media-icon shuffle-button shuffling" />
      ) : (
        <BiShuffle className="media-icon shuffle-button" />
      )}
    </div>
  );
}

function SkipBackButton() {
  return (
    <div onClick={() => console.log("skipBack")}>
      <BsFillSkipStartFill className="media-icon skip-button" />
    </div>
  );
}

function PlayButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div onClick={() => setIsPlaying(!isPlaying)}>
      {isPlaying ? (
        <FaPauseCircle className="media-icon play-button" />
      ) : (
        <FaPlayCircle className="media-icon play-button" />
      )}
    </div>
  );
}

function SkipForwardButton() {
  return (
    <div onClick={() => console.log("skipForward")}>
      <BsFillSkipEndFill className="media-icon skip-button" />
    </div>
  );
}
function RepeatButton() {
  const [repeat, setRepeat] = useState(0);
  const handleRepeat = () => {
    if (repeat === 2) {
      setRepeat(0);
    } else {
      setRepeat(repeat + 1);
    }
  };
  return (
    <div onClick={() => handleRepeat()}>
      {repeat === 1 ? (
        <TbRepeat className="media-icon repeat-button repeating" />
      ) : repeat === 2 ? (
        <TbRepeatOnce className="media-icon repeat-button repeating" />
      ) : (
        <TbRepeat className="media-icon repeat-button" />
      )}
    </div>
  );
}

export default MediaControlsBar;
