import React, { Component } from "react";

import VolumeBar from "./VolumeBar";
import { I18nAriaLabels } from "@/types";
import VolumeButton from "./VolumeButton";

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
    const { audio, i18nAriaLabels, onClickedVolumeButton } = this.props;
    const { volume } = this.state;
    return (
      <div
        className="flex items-center"
        style={{
          flex: "0 1 7.75rem",
        }}
      >
        <VolumeButton audio={audio} i18nAriaLabels={i18nAriaLabels} onClick={onClickedVolumeButton} />
        <VolumeBar audio={audio} i18nVolumeControl={i18nAriaLabels?.volumeControl} initVolume={volume} />
      </div>
    );
  }
}

export default VolumeControls;
