import React from "react";

import { ReactComponent as PlayIcon } from "../../../../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../../../../assets/icons/pause.svg";
import { I18nAriaLabels } from "../../../../types";
import "./PlayButton.css";

interface PlayButtonProps {
  audio?: HTMLAudioElement | null;
  togglePlay?: (e: React.SyntheticEvent) => void;
  i18nAriaLabels?: I18nAriaLabels;
}

interface PlayButtonState {
  isPlaying: boolean;
}

export default class PlayButton extends React.Component<PlayButtonProps, PlayButtonState> {
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
