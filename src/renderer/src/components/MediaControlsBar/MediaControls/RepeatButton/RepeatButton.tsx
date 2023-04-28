import React, { useState } from "react";
import { ReactComponent as LoopIcon } from "@/assets/icons/loop.svg";
import { ReactComponent as LoopOnceIcon } from "@/assets/icons/loop_once.svg";

interface RepeatButtonProps {
  audio?: HTMLAudioElement | null;
  handleClickRepeatButton?: () => void;
}

export default function RepeatButton({ audio, handleClickRepeatButton }: RepeatButtonProps): JSX.Element {
  const [repeat, setRepeat] = useState(0);
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);
  const handleRepeat = () => {
    if (repeat === 0) {
      setRepeat(1);
    }
    else if (repeat === 1) {
      setRepeat(2);
    }
    else if (repeat === 2) {
      setRepeat(0);
    }
    handleClickRepeatButton && handleClickRepeatButton();
  };

  return (
    <div className="h-8 aspect-square flex justify-center items-center" onClick={() => handleRepeat()}>
      {repeat === 1
        ? (
          <LoopIcon
            className="m-0 w-4 h-4 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
            id="repeat-all"
          />
        )
        : repeat === 2
          ? (
            <LoopOnceIcon
              className="m-0 w-4 h-4 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
              id="repeat-one"
            />
          )
          : (
            <LoopIcon
              className="m-0 w-4 h-4 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
              id="repeat-none"
            />
          )}
    </div>
  );
}
