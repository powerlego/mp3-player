import React, { Component } from "react";
import { ImVolumeMute2, ImVolumeMute, ImVolumeLow, ImVolumeMedium, ImVolumeHigh } from "react-icons/im";
import { I18nAriaLabels } from "../../../../types";

type VolumeButtonProps = {
  onClick: () => void;
  audio: HTMLAudioElement | null;
  i18nAriaLabels?: I18nAriaLabels;
};

type VolumeButtonState = {
  isMuted: boolean;
  volume: number;
};

export default class VolumeButton extends Component<VolumeButtonProps, VolumeButtonState> {
  state: VolumeButtonState = {
    isMuted: false,
    volume: 1,
  };

  hasAddedAudioEventListener = false;

  toggleMute = (): void => {
    const { onClick, audio } = this.props;
    const { isMuted } = this.state;
    if (!audio) {
      return;
    }
    onClick();
    audio.muted = !isMuted;
    this.setState({ isMuted: !isMuted });
  };

  checkMuted = (): void => {
    const { audio } = this.props;
    if (!audio) {
      return;
    }
    if (audio.volume === 0) {
      audio.muted = true;
      this.setState({ isMuted: true });
    }
    else {
      audio.muted = false;
      this.setState({ isMuted: false });
    }
  };

  checkVolume = (): void => {
    const { audio } = this.props;
    if (!audio) {
      return;
    }
    this.setState({ volume: audio.volume });
  };

  addEventListenerToAudio = (): void => {
    const { audio } = this.props;
    if (audio && !this.hasAddedAudioEventListener) {
      audio.addEventListener("volumechange", this.checkMuted);
      audio.addEventListener("volumechange", this.checkVolume);
      this.hasAddedAudioEventListener = true;
    }
  };

  removeEventListenerFromAudio = (): void => {
    const { audio } = this.props;
    if (audio && this.hasAddedAudioEventListener) {
      audio.removeEventListener("volumechange", this.checkMuted);
      audio.removeEventListener("volumechange", this.checkVolume);
      this.hasAddedAudioEventListener = false;
    }
  };

  componentDidMount() {
    this.addEventListenerToAudio();
  }

  componentDidUpdate() {
    this.addEventListenerToAudio();
  }

  componentWillUnmount() {
    this.removeEventListenerFromAudio();
  }

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

  render() {
    const { i18nAriaLabels } = this.props;
    const { isMuted, volume } = this.state;
    if (!this.isAudioAvailable()) {
      return (
        <div className="aspect-square h-8 flex items-center justify-center">
          <ImVolumeMute2 className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150 " />
        </div>
      );
    }
    else {
      return (
        <div
          aria-label={isMuted ? i18nAriaLabels?.volumeMute : i18nAriaLabels?.volume}
          className="aspect-square h-8 flex items-center justify-center"
          onClick={this.toggleMute}
        >
          {isMuted
            ? (
              <ImVolumeMute2 className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
            )
            : volume < 0.25
              ? (
                <ImVolumeMute className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
              )
              : volume < 0.5
                ? (
                  <ImVolumeLow className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
                )
                : volume < 0.75
                  ? (
                    <ImVolumeMedium className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
                  )
                  : (
                    <ImVolumeHigh className="m-0 w-4 h-4 cursor-pointer fill-gray-450 transition-all duration-300 ease-in-out hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150" />
                  )}
        </div>
      );
    }
  }
}
