import React from "react";
import { I18nAriaLabels } from "../../../types";
import "./MediaControls.css";
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
      <div className="media-controls-controls">
        <div className="media-controls-controls-left">
          <ShuffleButton audio={audio} />
          <SkipBackButton aria-label={i18nAriaLabels?.previous} />
        </div>
        <PlayButton audio={audio} i18nAriaLabels={i18nAriaLabels} togglePlay={togglePlay} />
        <div className="media-controls-controls-right">
          <SkipForwardButton aria-label={i18nAriaLabels?.next} />
          <RepeatButton />
        </div>
      </div>
    );
  }
}
