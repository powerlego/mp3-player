import React from "react";
import { Previous24Filled } from "@fluentui/react-icons";

interface SkipBackButtonProps {
  skipBack?: (e: React.SyntheticEvent) => void;
  audio?: HTMLAudioElement | null;
}

export default function SkipBackButton({ skipBack, audio }: SkipBackButtonProps): JSX.Element {
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);
  return isAudioAvailable
    ? (
      <div className="h-8 aspect-square flex justify-center items-center" onClick={skipBack}>
        <Previous24Filled
          className="m-0 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
          primaryFill=""
        />
      </div>
    )
    : (
      <div className="h-8 aspect-square flex justify-center items-center">
        <Previous24Filled className="m-0 fill-gray-350 dark:fill-gray-750" primaryFill="" />
      </div>
    );
}
