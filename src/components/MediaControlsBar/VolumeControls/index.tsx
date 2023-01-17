import React, { Component } from "react";
import { FaVolumeUp } from "react-icons/fa";
import VolumeBar from "./VolumeBar";
import { I18nAriaLabels } from "../../../types";

interface VolumeControlsProps {
    audio: HTMLAudioElement | null;
    i18nAriaLabels?: I18nAriaLabels;
}

interface VolumeControlsState {
    volume: number;
    muted: boolean;
}

class VolumeControls extends Component<VolumeControlsProps, VolumeControlsState> {
    state: VolumeControlsState = {
        volume: 1,
        muted: false,
    };

    handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { audio } = this.props;
        const { value } = e.target;
        const volume = Number(value) / 100;
        if (!audio) {
            return;
        }
        audio.volume = volume;
        this.setState({ volume });
    };

    toggleMute = (): void => {
        const { audio } = this.props;
        const { muted } = this.state;
        if (!audio) {
            return;
        }
        audio.muted = !muted;
        this.setState({ muted: !muted });
    };

    render() {
        const { audio, i18nAriaLabels } = this.props;
        const { volume, muted } = this.state;
        return (
            <div className="media-controls-volume">
                <button
                    aria-label={muted ? i18nAriaLabels?.volumeMute : i18nAriaLabels?.volume}
                    className="media-controls-volume-button"
                    onClick={this.toggleMute}
                >
                    <FaVolumeUp className="media-icon" />
                </button>
                <VolumeBar audio={audio} i18nVolumeControl={i18nAriaLabels?.volumeControl} volume={volume} />
            </div>
        );
    }
}

export default VolumeControls;
