import React from "react";
import { useState } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { FaPauseCircle } from "react-icons/fa";
import { BsFillSkipEndFill } from "react-icons/bs";
import { BsFillSkipStartFill } from "react-icons/bs";
import { BiShuffle } from "react-icons/bi";
import { TbRepeat } from "react-icons/tb";
import { TbRepeatOnce } from "react-icons/tb";

function MediaControls() {
  return (
    <footer className="media-controls">
      <div className="media-controls__container">
        <ShuffleButton />
        <BsFillSkipStartFill className="media-icon skip-button" />
        <PlayButton />
        <SkipForwardButton />
        <RepeatButton />
      </div>
    </footer>
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

function SkipForwardButton() {
  return (
    <div onClick={() => console.log("skipForward")}>
      <BsFillSkipEndFill className="media-icon skip-button" />
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

export default MediaControls;
