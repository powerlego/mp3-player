import React from "react";
import { ReactComponent as SkipForwardIcon } from "../../../../assets/icons/skip_forward.svg";
export default function SkipForwardButton() {
  return (
    <div
      className="h-8 aspect-square flex justify-center items-center"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const filePath = await window.electron.getAudioFile();
        console.log(filePath);
      }}
    >
      <SkipForwardIcon className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
    </div>
  );
}
