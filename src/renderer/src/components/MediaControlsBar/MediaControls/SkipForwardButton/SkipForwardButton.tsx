import React from "react";
import { ReactComponent as SkipForwardIcon } from "@/assets/icons/skip_forward.svg";

interface SkipForwardButtonProps {
  skipForward?: (e: React.SyntheticEvent) => void;
  audio?: HTMLAudioElement | null;
}

export default function SkipForwardButton({ skipForward, audio }: SkipForwardButtonProps): JSX.Element {
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);
  return isAudioAvailable ? (
    <div className="h-8 aspect-square flex justify-center items-center" onClick={skipForward}>
      <SkipForwardIcon className="m-0 w-4 h-4 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-600 hover:fill-gray-550 dark:fill-gray-500 hover:dark:fill-gray-350" />
    </div>
  ) : (
    <div className="h-8 aspect-square flex justify-center items-center">
      <SkipForwardIcon className="m-0 w-4 h-4 fill-gray-450 dark:fill-gray-550" />
    </div>
  );
}
