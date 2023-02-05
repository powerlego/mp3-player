import React from "react";
import { ReactComponent as SkipForwardIcon } from "../../../../assets/icons/skip_forward.svg";
export default function SkipForwardButton() {
  return (
    <div
      className="h-8 aspect-square flex justify-center items-center"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
    >
      <SkipForwardIcon className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
    </div>
  );
}
