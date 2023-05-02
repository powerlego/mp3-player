import React, { useState } from "react";
import { ArrowShuffle24Filled } from "@fluentui/react-icons";

interface ShuffleButtonProps {
  setShuffle?: React.Dispatch<React.SetStateAction<boolean>>;
  shuffle?: boolean;
}

export default function ShuffleButton({ setShuffle, shuffle }: ShuffleButtonProps) {
  const [isShuffle, setIsShuffle] = useState(false);
  let handleShuffle: () => void;
  if (setShuffle) {
    if (typeof shuffle === "boolean") {
      handleShuffle = () => setShuffle(!shuffle);
    }
    else {
      handleShuffle = () => setShuffle(!isShuffle);
    }
  }
  else {
    handleShuffle = () => setIsShuffle(!isShuffle);
  }

  return (
    <div className="h-8 aspect-square flex justify-center items-center" onClick={() => handleShuffle()}>
      {shuffle ?? isShuffle
        ? (
          <ArrowShuffle24Filled
            className="m-0 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
            primaryFill=""
          />
        )
        : (
          <ArrowShuffle24Filled
            className="m-0 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
            primaryFill=""
          />
        )}
    </div>
  );
}
