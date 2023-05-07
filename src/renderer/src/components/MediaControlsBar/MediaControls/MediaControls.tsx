import React from "react";
import { I18nAriaLabels } from "@/types";
import PlayButton from "./PlayButton";
import RepeatButton from "./RepeatButton";
import ShuffleButton from "./ShuffleButton";
import SkipBackButton from "./SkipBackButton";
import SkipForwardButton from "./SkipForwardButton";

interface MediaControlsProps {
  audio: HTMLAudioElement | null;
  togglePlay?: (e: React.SyntheticEvent) => void;
  handleClickRepeatButton?: () => void;
  shuffle?: boolean;
  setShuffle?: React.Dispatch<React.SetStateAction<boolean>>;
  repeat?: number;
  setRepeat?: React.Dispatch<React.SetStateAction<number>>;
  handleSkipBack?: () => void;
  handleSkipForward?: () => void;
  i18nAriaLabels?: I18nAriaLabels;
}

export default function MediaControls({
  audio,
  togglePlay,
  i18nAriaLabels,
  handleClickRepeatButton,
  shuffle,
  setShuffle,
  repeat,
  handleSkipBack,
  handleSkipForward,
}: MediaControlsProps) {
  return (
    <div className="mb-1 flex flex-row items-center justify-evenly gap-3 w-full">
      <div className="flex items-center justify-end w-full flex-1 gap-2">
        <ShuffleButton setShuffle={setShuffle} shuffle={shuffle} />
        <SkipBackButton aria-label={i18nAriaLabels?.previous} audio={audio} skipBack={handleSkipBack} />
      </div>
      <PlayButton audio={audio} i18nAriaLabels={i18nAriaLabels} togglePlay={togglePlay} />
      <div className="flex items-center justify-start w-full flex-1 gap-2">
        <SkipForwardButton aria-label={i18nAriaLabels?.next} audio={audio} skipForward={handleSkipForward} />
        <RepeatButton handleClickRepeatButton={handleClickRepeatButton} repeat={repeat} />
      </div>
    </div>
  );
}
