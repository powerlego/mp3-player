import React, { useState } from "react";
import { ReactComponent as ShuffleIcon } from "@/assets/icons/shuffle.svg";

interface ShuffleButtonProps {
  audio?: HTMLAudioElement | null;
  toggleShuffle?: () => void;
}

export default function ShuffleButton({ audio, toggleShuffle }: ShuffleButtonProps) {
  const [isShuffle, setIsShuffle] = useState(false);
  const handleShuffle = toggleShuffle ? toggleShuffle : () => setIsShuffle(!isShuffle);
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);
  if (!isAudioAvailable) {
    return (
      <div className="h-8 aspect-square flex justify-center items-center">
        <ShuffleIcon className="m-0 w-4 h-4 fill-gray-350 dark:fill-gray-750" />
      </div>
    );
  }
  else {
    return (
      <div className="h-8 aspect-square flex justify-center items-center" onClick={() => handleShuffle()}>
        {isShuffle
          ? (
            <ShuffleIcon className="m-0 w-4 h-4 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700" />
          )
          : (
            <ShuffleIcon className="m-0 w-4 h-4 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150" />
          )}
      </div>
    );
  }
}
