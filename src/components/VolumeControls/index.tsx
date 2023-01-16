import React, { Component, ReactNode } from "react";
import { FaVolumeUp } from "react-icons/fa";

class VolumeControls extends Component {
    render() {
        return (
            <div className="media-controls-volume">
                <button className="media-controls-volume-button">
                    <FaVolumeUp className="media-icon" />
                </button>
                <input
                    type="range"
                    className="media-controls-volume-slider"
                    min="0"
                    max="100"
                    step="1"
                    defaultValue="100"
                />
            </div>
        );
    }
}
