import React from "react";
import { ReactComponent as SkipForwardIcon } from "../../../../assets/icons/skip_forward.svg";
export default function SkipForwardButton() {
  return (
    <div
      className="media-icon-skip-container"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const filePath = await window.electron.getAudioFile();
        console.log(filePath);
      }}
    >
      <SkipForwardIcon className="media-icon skip-button" />
    </div>
  );
}
