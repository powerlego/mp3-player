import React from "react";
import { ReactComponent as SkipBackwardIcon } from "../../../../assets/icons/skip_backward.svg";

interface SkipBackButtonProps {
  skipBack?: (e: React.SyntheticEvent) => void;
}

export default function SkipBackButton({ skipBack }: SkipBackButtonProps): JSX.Element {
  return (
    <div className="h-8 aspect-square flex justify-center items-center" onClick={skipBack}>
      <SkipBackwardIcon className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
    </div>
  );
}
