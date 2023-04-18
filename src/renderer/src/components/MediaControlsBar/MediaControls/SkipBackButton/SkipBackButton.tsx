import React from "react";
import { ReactComponent as SkipBackwardIcon } from "@/assets/icons/skip_backward.svg";

interface SkipBackButtonProps {
  skipBack?: (e: React.SyntheticEvent) => void;
  audio?: HTMLAudioElement | null;
}

export default function SkipBackButton({ skipBack, audio }: SkipBackButtonProps): JSX.Element {
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);
  return isAudioAvailable
    ? (
      <div className="h-8 aspect-square flex justify-center items-center" onClick={skipBack}>
        <SkipBackwardIcon className="m-0 w-4 h-4 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150" />
      </div>
    )
    : (
      <div className="h-8 aspect-square flex justify-center items-center">
        <SkipBackwardIcon className="m-0 w-4 h-4 fill-gray-350 dark:fill-gray-750" />
      </div>
    );
}
