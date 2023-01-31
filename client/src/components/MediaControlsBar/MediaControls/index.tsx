import React from "react";
import { I18nAriaLabels } from "../../../types";
import PlayButton from "./PlayButton";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import SkipBackButton from "./SkipBackButton";
import SkipForwardButton from "./SkipForwardButton";

interface MediaControlsProps {
  audio: HTMLAudioElement | null;
  togglePlay?: (e: React.SyntheticEvent) => void;
  i18nAriaLabels?: I18nAriaLabels;
}

export default class MediaControls extends React.Component<MediaControlsProps> {
  render() {
    const { audio, togglePlay, i18nAriaLabels } = this.props;
    return (
      <div className="mb-4 flex flex-row items-center justify-evenly gap-4 w-full">
        <div className="flex items-center justify-end w-full flex-1 gap-2">
          <ShuffleButton audio={audio} />
          <SkipBackButton aria-label={i18nAriaLabels?.previous} />
        </div>
        <PlayButton audio={audio} i18nAriaLabels={i18nAriaLabels} togglePlay={togglePlay} />
        <div className="flex items-center justify-start w-full flex-1 gap-2">
          <SkipForwardButton aria-label={i18nAriaLabels?.next} />
          <RepeatButton />
        </div>
      </div>
    );
  }
}
