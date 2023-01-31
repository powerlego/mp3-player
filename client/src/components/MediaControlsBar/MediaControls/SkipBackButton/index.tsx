import React from "react";
import { ReactComponent as SkipBackwardIcon } from "../../../../assets/icons/skip_backward.svg";

export default function SkipBackButton() {
  return (
    <div className="h-8 aspect-square flex justify-center items-center" onClick={() => console.log("skipBack")}>
      <SkipBackwardIcon className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
    </div>
  );
}
