import React, { Component } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
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
};

class VolumeButton extends Component<VolumeButtonProps, VolumeButtonState> {
    state: VolumeButtonState = {
        isMuted: false,
    };

    toggleMute = (): void => {
        const { onClick } = this.props;
        const { isMuted } = this.state;
        onClick();
        this.setState({ isMuted: !isMuted });
    };

    checkMuted = (): void => {
        const { audio } = this.props;
        if (!audio) {
            return;
        }
        this.setState({ isMuted: audio.muted });
    };

    render() {
        const { i18nAriaLabels } = this.props;
        const { isMuted } = this.state;
        return (
            <div
                aria-label={isMuted ? i18nAriaLabels?.volumeMute : i18nAriaLabels?.volume}
                className="media-controls-volume-button"
                onClick={this.toggleMute}
            >
                {isMuted
                    ? (
                        <FaVolumeMute className="media-icon volume-button" />
                    )
                    : (
                        <FaVolumeUp className="media-icon volume-button" />
                    )}
            </div>
        );
    }
}

export default VolumeControls;
