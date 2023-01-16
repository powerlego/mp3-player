import React, { Component } from "react";
import { FaVolumeUp } from "react-icons/fa";
import VolumeBar from "./VolumeBar";

interface VolumeControlsProps {
    audio: HTMLAudioElement | null;
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
        if (!audio) {return;}
        audio.volume = volume;
        this.setState({ volume });
    };

    toggleMute = (): void => {
        const { audio } = this.props;
        const { muted } = this.state;
        if(!audio) {return;}
        audio.muted = !muted;
        this.setState({ muted: !muted });
    };

    render() {
        return (
            <div className="media-controls-volume">
                <button className="media-controls-volume-button" onClick={this.toggleMute}>
                    <FaVolumeUp className="media-icon" />
                </button>
                <VolumeBar/>
            </div>
        );
    }
}

export default VolumeControls;
