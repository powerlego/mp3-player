import React from "react";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { BsFillSkipEndFill } from "react-icons/bs";
import { BsFillSkipStartFill } from "react-icons/bs";
import { BiShuffle } from "react-icons/bi";
import { TbRepeat } from "react-icons/tb";


function MediaControls() {
  return (
    <footer className="media-controls">
      <div className="media-controls__container">
        <BiShuffle className="media-icon shuffle-button" />
        <BsFillSkipStartFill className="media-icon skip-button" />
        <BsFillPlayCircleFill className="media-icon play-button" />
        <BsFillSkipEndFill className="media-icon skip-button" />
        <TbRepeat className="media-icon repeat-button" />
      </div>
    </footer>
  );
}

export default MediaControls;
