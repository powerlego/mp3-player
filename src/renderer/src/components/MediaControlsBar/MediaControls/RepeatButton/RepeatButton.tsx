import React, { useState } from "react";
import { ArrowRepeatAll24Filled, ArrowRepeat124Filled } from "@fluentui/react-icons";

interface RepeatButtonProps {
  repeat?: number;
  handleClickRepeatButton?: () => void;
}

export default function RepeatButton({ repeat, handleClickRepeatButton }: RepeatButtonProps): JSX.Element {
  const [repeatState, setRepeatState] = useState(0);

  const handleRepeat = handleClickRepeatButton
    ? handleClickRepeatButton
    : () => {
      if (repeat === 0) {
        setRepeatState(1);
      }
      else if (repeat === 1) {
        setRepeatState(2);
      }
      else if (repeat === 2) {
        setRepeatState(0);
      }
    };

  return (
    <div className="h-8 aspect-square flex justify-center items-center" onClick={() => handleRepeat()}>
      {(typeof repeat === "number" ? repeat : repeatState) === 1
        ? (
          <ArrowRepeatAll24Filled
            className="m-0 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
            id="repeat-all"
            primaryFill=""
          />
        )
        : (typeof repeat === "number" ? repeat : repeatState) === 2
          ? (
            <ArrowRepeat124Filled
              className="m-0 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
              id="repeat-one"
              primaryFill=""
            />
          )
          : (
            <ArrowRepeatAll24Filled
              className="m-0 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
              id="repeat-none"
              primaryFill=""
            />
          )}
    </div>
  );
}
