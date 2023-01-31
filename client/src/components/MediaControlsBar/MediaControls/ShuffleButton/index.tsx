import React, { useState } from "react";
import { ReactComponent as ShuffleIcon } from "../../../../assets/icons/shuffle.svg";
import "./ShuffleButton.css";

interface ShuffleButtonProps {
  audio?: HTMLAudioElement | null;
}

export default function ShuffleButton({ audio }: ShuffleButtonProps) {
  const [isShuffle, setIsShuffle] = useState(false);
  const handleShuffle = () => setIsShuffle(!isShuffle);
  if (!audio) {
    return (
      <div className="media-icon-container">
        <ShuffleIcon className="media-icon" />
      </div>
    );
  }
  else {
    return (
      <div className="media-icon-container" onClick={() => handleShuffle()}>
        {isShuffle
          ? (
            <ShuffleIcon className="media-icon shuffling has-media-icon" />
          )
          : (
            <ShuffleIcon className="media-icon non-scale-stroke has-media-icon" />
          )}
      </div>
    );
  }
}
