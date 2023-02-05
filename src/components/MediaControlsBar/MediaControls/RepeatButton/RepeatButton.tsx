import React, { useState } from "react";
import { ReactComponent as LoopIcon } from "@/assets/icons/loop.svg";
import { ReactComponent as LoopOnceIcon } from "@/assets/icons/loop_once.svg";

interface RepeatButtonProps {
  audio?: HTMLAudioElement | null;
}

export default function RepeatButton({ audio }: RepeatButtonProps): JSX.Element {
  const [repeat, setRepeat] = useState(0);
  const isAudioAvailable = audio && audio.src !== "" && audio.src !== window.location.href;
  const handleRepeat = () => {
    if (repeat === 2) {
      setRepeat(0);
    }
    else {
      setRepeat(repeat + 1);
    }
  };
  return isAudioAvailable
    ? (
      <div className="h-8 aspect-square flex justify-center items-center" onClick={() => handleRepeat()}>
        {repeat === 1
          ? (
            <LoopIcon
              className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out fill-green-450 hover:fill-green-500 dark:fill-green-350 hover:dark:fill-green-450"
              id="repeat-all"
            />
          )
          : repeat === 2
            ? (
              <LoopOnceIcon
                className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out fill-green-450 hover:fill-green-500 dark:fill-green-350 hover:dark:fill-green-450"
                id="repeat-one"
              />
            )
            : (
              <LoopIcon
                className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-600 hover:fill-gray-550 dark:fill-gray-500 hover:dark:fill-gray-350"
                id="repeat-none"
              />
            )}
      </div>
    )
    : (
      <div className="h-8 aspect-square flex justify-center items-center">
        <LoopIcon className="m-0 w-4 h-4 cursor-pointer fill-gray-450 dark:fill-gray-550" id="repeat-none" />
      </div>
    );
}
