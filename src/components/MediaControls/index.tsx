import React from "react";
import { ReactComponent as PlayIcon } from "../../assets/icons/play.svg";

function MediaControls() {
  return (
    <footer className="media-controls">
      <div className="media-controls__container">
        <PlayIcon className="media-icon"/>
      </div>
    </footer>
  );
}

export default MediaControls;
