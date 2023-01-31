import React, { useState } from "react";
import { ReactComponent as LoopIcon } from "../../../../assets/icons/loop.svg";
import { ReactComponent as LoopOnceIcon } from "../../../../assets/icons/loop_once.svg";

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
    <div
      className="h-8 aspect-square flex justify-center items-center"
      data-testid="repeat-button"
      onClick={() => handleRepeat()}
    >
      {repeat === 1
        ? (
          <LoopIcon
            className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out fill-green-450 hover:fill-green-500 dark:fill-green-350 hover:dark:fill-green-450"
            data-testid="repeat-icon"
            id="repeat-all"
          />
        )
        : repeat === 2
          ? (
            <LoopOnceIcon
              className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out fill-green-450 hover:fill-green-500 dark:fill-green-350 hover:dark:fill-green-450"
              data-testid="repeat-icon"
              id="repeat-one"
            />
          )
          : (
            <LoopIcon
              className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150"
              data-testid="repeat-icon"
              id="repeat-none"
            />
          )}
    </div>
  );
}
