import React from "react";
import { ReactComponent as SkipBackwardIcon } from "../../../../assets/icons/skip_backward.svg";

export default function SkipBackButton() {
  return (
    <div className="media-icon-skip-container" onClick={() => console.log("skipBack")}>
      <SkipBackwardIcon className="media-icon skip-button" />
    </div>
  );
}
