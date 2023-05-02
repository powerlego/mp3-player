import React from "react";
import { Next24Filled } from "@fluentui/react-icons";

interface SkipForwardButtonProps {
  skipForward?: (e: React.SyntheticEvent) => void;
  audio?: HTMLAudioElement | null;
}

export default function SkipForwardButton({ skipForward, audio }: SkipForwardButtonProps): JSX.Element {
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);
  return isAudioAvailable
    ? (
      <div className="h-8 aspect-square flex justify-center items-center" onClick={skipForward}>
        <Next24Filled
          className="m-0 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
          primaryFill=""
        />
      </div>
    )
    : (
      <div className="h-8 aspect-square flex justify-center items-center">
        <Next24Filled className="m-0 fill-gray-350 dark:fill-gray-750" primaryFill="" />
      </div>
    );
}
