import React, { Component } from "react";
import { ImVolumeMute2, ImVolumeMute, ImVolumeLow, ImVolumeMedium, ImVolumeHigh } from "react-icons/im";
import VolumeBar from "./VolumeBar";
import { I18nAriaLabels } from "../../../types";
import "./VolumeControls.css";

interface VolumeControlsProps {
  audio: HTMLAudioElement | null;
  onMuteChange: () => void;
  onClickedVolumeButton: () => void;
  i18nAriaLabels?: I18nAriaLabels;
}

interface VolumeControlsState {
  volume: number;
}

class VolumeControls extends Component<VolumeControlsProps, VolumeControlsState> {
  state: VolumeControlsState = {
    volume: 1,
  };

  render() {
    const { audio, i18nAriaLabels, onMuteChange, onClickedVolumeButton } = this.props;
    const { volume } = this.state;
    return (
      <div className="media-controls-volume">
        <VolumeButton audio={audio} i18nAriaLabels={i18nAriaLabels} onClick={onClickedVolumeButton} />
        <VolumeBar
          audio={audio}
          i18nVolumeControl={i18nAriaLabels?.volumeControl}
          volume={volume}
          onMuteChange={onMuteChange}
        />
      </div>
    );
  }
}

type VolumeButtonProps = {
  onClick: () => void;
  audio: HTMLAudioElement | null;
  i18nAriaLabels?: I18nAriaLabels;
};

type VolumeButtonState = {
  isMuted: boolean;
  volume: number;
};

class VolumeButton extends Component<VolumeButtonProps, VolumeButtonState> {
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
        <div className="media-controls-volume-button">
          <ImVolumeMute2 className="media-icon volume-button" />
        </div>
      );
    }
    else {
      return (
        <div
          aria-label={isMuted ? i18nAriaLabels?.volumeMute : i18nAriaLabels?.volume}
          className="media-controls-volume-button"
          onClick={this.toggleMute}
        >
          {isMuted
            ? (
              <ImVolumeMute2 className="media-icon volume-button has-media" />
            )
            : volume < 0.25
              ? (
                <ImVolumeMute className="media-icon volume-button has-media" />
              )
              : volume < 0.5
                ? (
                  <ImVolumeLow className="media-icon volume-button has-media" />
                )
                : volume < 0.75
                  ? (
                    <ImVolumeMedium className="media-icon volume-button has-media" />
                  )
                  : (
                    <ImVolumeHigh className="media-icon volume-button has-media" />
                  )}
        </div>
      );
    }
  }
}

export default VolumeControls;
