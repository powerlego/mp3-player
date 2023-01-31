import React, { useState } from "react";
import { ReactComponent as LoopIcon } from "../../../../assets/icons/loop.svg";
import { ReactComponent as LoopOnceIcon } from "../../../../assets/icons/loop_once.svg";
import "./RepeatButton.css";

export default function RepeatButton() {
  const [repeat, setRepeat] = useState(0);
  const handleRepeat = () => {
    if (repeat === 2) {
      setRepeat(0);
    }
    else {
      setRepeat(repeat + 1);
    }
  };
  return (
    <div className="media-icon-container" onClick={() => handleRepeat()}>
      {repeat === 1
        ? (
          <LoopIcon className="media-icon repeat-button repeating" />
        )
        : repeat === 2
          ? (
            <LoopOnceIcon className="media-icon repeat-button repeating" />
          )
          : (
            <LoopIcon className="media-icon repeat-button" />
          )}
    </div>
  );
}
