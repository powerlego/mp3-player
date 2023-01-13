import React from "react";
import { useState } from "react";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { BiShuffle } from "react-icons/bi";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
import "./MediaControls.css";
import { getPosX } from "../../utils";

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
      <ProgressBar />
      <div className="media-controls__progress__time"> 99:99 </div>
    </div>
  );
}

interface TimePosInfo {
  currentTime: number;
  currentTimePos: string;
}

function ProgressBar() {
  const [currentTimePos, setCurrentTimePos] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [timeOnMouseMove, setTimeOnMouseMove] = useState(0);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const getCurrentProgress = (
    event: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent
  ): TimePosInfo => {
    const rect = progressRef.current!.getBoundingClientRect();
    const maxRelativePos = rect.width;

    let relativePos = getPosX(event) - rect.left;

    if (relativePos < 0) {
      relativePos = 0;
    } else if (relativePos > maxRelativePos) {
      relativePos = maxRelativePos;
    }

    const currentTime = (relativePos / maxRelativePos) * 100;
    const currentTimePos = `${currentTime.toFixed(2)}%`;
    return { currentTime, currentTimePos };
  };

  const handleMouseDownOrTouchStart = (
    event: React.MouseEvent | React.TouchEvent
  ): void => {
    event.stopPropagation();
    const { currentTime, currentTimePos } = getCurrentProgress(event);

    if (isFinite(currentTime)) {
      setTimeOnMouseMove(currentTime);
      setCurrentTimePos(currentTimePos);
      setIsDragging(true);
      if (event.nativeEvent instanceof MouseEvent) {
        window.addEventListener("mousemove", handleMouseOrTouchMove);
        window.addEventListener("mouseup", handleMouseOrTouchUp);
      } else {
        window.addEventListener("touchmove", handleMouseOrTouchMove);
        window.addEventListener("touchend", handleMouseOrTouchUp);
      }
    }
  };

  const handleMouseOrTouchMove = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
    event.stopPropagation();
    const windowSelection: Selection | null = window.getSelection();
    if (windowSelection && windowSelection.type === "Range") {
      windowSelection.empty();
    }

    if (isDragging) {
      const { currentTime, currentTimePos } = getCurrentProgress(event);
      if (isFinite(currentTime)) {
        setTimeOnMouseMove(currentTime);
        setCurrentTimePos(currentTimePos);
      }
    }
  };

  const handleMouseOrTouchUp = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    setIsDragging(false);

    if (event instanceof MouseEvent) {
      window.removeEventListener("mousemove", handleMouseOrTouchMove);
      window.removeEventListener("mouseup", handleMouseOrTouchUp);
    } else {
      window.removeEventListener("touchmove", handleMouseOrTouchMove);
      window.removeEventListener("touchend", handleMouseOrTouchUp);
    }
  };

  const fillerStyle = {
    width: `${currentTimePos}`,
  };

  return (
    <div
      className="media-controls__progress__container group "
      onTouchStart={handleMouseDownOrTouchStart}
      onMouseDown={handleMouseDownOrTouchStart}
      ref={progressRef}
    >
      <div className="media-controls__progress__bar ">
        <div
          className="media-controls__progress__bar__progress flex items-center justify-end group-hover:bg-green-500 dark:group-hover:bg-green-500"
          style={fillerStyle}
        ></div>
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
