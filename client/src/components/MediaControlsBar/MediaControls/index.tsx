import React, { useState } from "react";
import { ReactComponent as PlayIcon } from "../../../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../../../assets/icons/pause.svg";
import { ReactComponent as SkipBackwardIcon } from "../../../assets/icons/skip_backward.svg";
import { ReactComponent as SkipForwardIcon } from "../../../assets/icons/skip_forward.svg";
import { ReactComponent as ShuffleIcon } from "../../../assets/icons/shuffle.svg";
import { ReactComponent as LoopIcon } from "../../../assets/icons/loop.svg";
import { ReactComponent as LoopOnceIcon } from "../../../assets/icons/loop_once.svg";
import { I18nAriaLabels } from "../../../types";

import "./MediaControls.css";

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

interface ShuffleButtonProps {
  audio?: HTMLAudioElement | null;
}

function ShuffleButton({ audio }: ShuffleButtonProps) {
  const [isShuffle, setIsShuffle] = useState(false);
  const handleShuffle = () => setIsShuffle(!isShuffle);
  if (!audio) {
    return (
      <div className="media-icon-container">
        <ShuffleIcon className="media-icon" />
      </div>
    );
  }
  else {
    return (
      <div className="media-icon-container" onClick={() => handleShuffle()}>
        {isShuffle
          ? (
            <ShuffleIcon className="media-icon shuffling has-media-icon" />
          )
          : (
            <ShuffleIcon className="media-icon non-scale-stroke has-media-icon" />
          )}
      </div>
    );
  }
}

function SkipBackButton() {
  return (
    <div className="media-icon-skip-container" onClick={() => console.log("skipBack")}>
      <SkipBackwardIcon className="media-icon skip-button" />
    </div>
  );
}

interface PlayButtonProps {
  audio?: HTMLAudioElement | null;
  togglePlay?: (e: React.SyntheticEvent) => void;
  i18nAriaLabels?: I18nAriaLabels;
}

interface PlayButtonState {
  isPlaying: boolean;
}

class PlayButton extends React.Component<PlayButtonProps, PlayButtonState> {
  addedEventListeners = false;

  state: PlayButtonState = {
    isPlaying: false,
  };
  isPlaying = (): boolean => {
    const { audio } = this.props;
    if (!audio) {
      return false;
    }

    return !audio.paused && !audio.ended;
  };
  isAudioAvailable = (): boolean => {
    const { audio } = this.props;
    if (!audio) {
      return false;
    }
    if (audio.src === "" || audio.src === window.location.href) {
      return false;
    }
    return true;
  };

  addEventListeners = () => {
    const { audio } = this.props;
    if (!audio) {
      return;
    }
    audio.addEventListener("play", () => {
      this.setState({ isPlaying: true });
    });
    audio.addEventListener("pause", () => {
      this.setState({ isPlaying: false });
    });
    audio.addEventListener("ended", () => {
      this.setState({ isPlaying: false });
    });
    this.addedEventListeners = true;
  };

  removeEventListeners = () => {
    const { audio } = this.props;
    if (!audio) {
      return;
    }
    audio.removeEventListener("play", () => {
      this.setState({ isPlaying: true });
    });
    audio.removeEventListener("pause", () => {
      this.setState({ isPlaying: false });
    });
    audio.removeEventListener("ended", () => {
      this.setState({ isPlaying: false });
    });
    this.addedEventListeners = false;
  };

  componentDidMount() {
    this.addEventListeners();
  }

  componentDidUpdate() {
    this.addEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  render() {
    const { togglePlay, i18nAriaLabels } = this.props;
    const { isPlaying } = this.state;
    if (!this.isAudioAvailable()) {
      return (
        <div className="play-button-container">
          <PauseIcon className="media-icon play-button" />
        </div>
      );
    }
    else {
      return (
        <div
          className="play-button-container has-media transition-all ease-in-out duration-200 hover:scale-[1.1]"
          onClick={togglePlay}
        >
          {isPlaying
            ? (
              <PauseIcon aria-label={i18nAriaLabels?.play} className="play-button" />
            )
            : (
              <PlayIcon aria-label={i18nAriaLabels?.pause} className="play-button" />
            )}
        </div>
      );
    }
  }
}

function SkipForwardButton() {
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
function RepeatButton() {
  const [repeat, setRepeat] = useState(0);
  const handleRepeat = () => {
    if (repeat === 2) {
      setRepeat(0);
    }
    else {
      setRepeat(repeat + 1);
    }
  };
  return (
    <div className="media-icon-container" onClick={() => handleRepeat()}>
      {repeat === 1
        ? (
          <LoopIcon className="media-icon repeat-button repeating" />
        )
        : repeat === 2
          ? (
            <LoopOnceIcon className="media-icon repeat-button repeating" />
          )
          : (
            <LoopIcon className="media-icon repeat-button" />
          )}
    </div>
  );
}
