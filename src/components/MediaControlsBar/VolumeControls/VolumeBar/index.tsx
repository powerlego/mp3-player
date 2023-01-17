import React, { Component, SyntheticEvent } from "react";
import { getPosX } from "../../../../utils";
import "./VolumeBar.css";

type VolumeBarProps = {
    audio: HTMLAudioElement | null;
    volume: number;
    onMuteChange: () => void;
    i18nVolumeControl?: string;
};

type VolumeBarState = {
    currentVolumePos: string;
    hasVolumeAnimation: boolean;
    isDraggingVolume: boolean;
};

type VolumePosInfo = {
    currentVolume: number;
    currentVolumePos: string;
};

export default class VolumeBar extends Component<VolumeBarProps, VolumeBarState> {
    audio?: HTMLAudioElement;

    hasAddedAudioEventListener = false;

    volumeBar = React.createRef<HTMLDivElement>();

    volumeAnimationTimer = 0;

    lastVolume = this.props.volume;

    state: VolumeBarState = {
        currentVolumePos: `${((this.lastVolume / 1) * 100 || 0).toFixed(2)}%`,
        hasVolumeAnimation: false,
        isDraggingVolume: false,
    };

    // get volume info while dragging by indicator mouse or touch
    getCurrentVolume = (event: TouchEvent | MouseEvent): VolumePosInfo => {
        const { audio } = this.props;
        if (!audio) {
            return {
                currentVolume: this.lastVolume,
                currentVolumePos: `${((this.lastVolume / 1) * 100 || 0).toFixed(2)}%`,
            };
        }
        if (!this.volumeBar.current) {
            return {
                currentVolume: audio.volume,
                currentVolumePos: this.state.currentVolumePos,
            };
        }
        const volumeBarRect = this.volumeBar.current.getBoundingClientRect();
        const maxRelativePos = volumeBarRect.width;
        const relativePos = getPosX(event) - volumeBarRect.left;
        let currentVolume;
        let currentVolumePos;

        if (relativePos < 0) {
            currentVolume = 0;
            currentVolumePos = "0%";
        }
        else if (relativePos > volumeBarRect.width) {
            currentVolume = 1;
            currentVolumePos = "100%";
        }
        else {
            currentVolume = relativePos / maxRelativePos;
            currentVolumePos = `${(relativePos / maxRelativePos) * 100}%`;
        }

        return { currentVolume, currentVolumePos };
    };

    handleContextMenu = (event: SyntheticEvent): void => {
        event.preventDefault();
    };

    handleVolumeControlMouseOrTouchDown = (event: React.MouseEvent | React.TouchEvent): void => {
        event.stopPropagation();
        const { audio } = this.props;
        const { currentVolume, currentVolumePos } = this.getCurrentVolume(event.nativeEvent);
        if (!audio) {
            return;
        }
        audio.volume = currentVolume;
        this.setState({ isDraggingVolume: true, currentVolumePos });

        if (event.nativeEvent instanceof MouseEvent) {
            window.addEventListener("mousemove", this.handleWindowMouseOrTouchMove);
            window.addEventListener("mouseup", this.handleWindowMouseOrTouchUp);
        }
        else {
            window.addEventListener("touchmove", this.handleWindowMouseOrTouchMove);
            window.addEventListener("touchend", this.handleWindowMouseOrTouchUp);
        }
    };

    handleWindowMouseOrTouchMove = (event: TouchEvent | MouseEvent): void => {
        if (event instanceof MouseEvent) {
            event.preventDefault();
        }
        event.stopPropagation();
        const { audio } = this.props;
        if (!audio) {
            return;
        }
        // Prevent Chrome drag selection bug
        const windowSelection: Selection | null = window.getSelection();
        if (windowSelection && windowSelection.type === "Range") {
            windowSelection.empty();
        }

        const { isDraggingVolume } = this.state;
        if (isDraggingVolume) {
            const { currentVolume, currentVolumePos } = this.getCurrentVolume(event);
            audio.volume = currentVolume;
            this.setState({ currentVolumePos });
        }
    };

    handleWindowMouseOrTouchUp = (event: MouseEvent | TouchEvent): void => {
        event.stopPropagation();
        this.setState({ isDraggingVolume: false });

        if (event instanceof MouseEvent) {
            window.removeEventListener("mousemove", this.handleWindowMouseOrTouchMove);
            window.removeEventListener("mouseup", this.handleWindowMouseOrTouchUp);
        }
        else {
            window.removeEventListener("touchmove", this.handleWindowMouseOrTouchMove);
            window.removeEventListener("touchend", this.handleWindowMouseOrTouchUp);
        }
    };

    handleAudioVolumeChange = (e: Event): void => {
        const { isDraggingVolume } = this.state;
        const { volume } = e.target as HTMLAudioElement;
        this.lastVolume = volume;
        if (isDraggingVolume) {
            return;
        }
        this.setState({
            hasVolumeAnimation: true,
            currentVolumePos: `${((volume / 1) * 100 || 0).toFixed(2)}%`,
        });
        clearTimeout(this.volumeAnimationTimer);
        this.volumeAnimationTimer = setTimeout(() => {
            this.setState({ hasVolumeAnimation: false });
        }, 100);
    };

    componentDidUpdate(): void {
        const { audio } = this.props;
        if (audio && !this.hasAddedAudioEventListener) {
            this.audio = audio;
            this.hasAddedAudioEventListener = true;
            audio.addEventListener("volumechange", (e: Event) => {
                this.handleAudioVolumeChange(e);
            });
        }
    }

    componentWillUnmount(): void {
        if (this.audio && this.hasAddedAudioEventListener) {
            this.audio.removeEventListener("volumechange", (e: Event) => {
                this.handleAudioVolumeChange(e);
            });
        }

        clearTimeout(this.volumeAnimationTimer);
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

    render(): React.ReactNode {
        const { audio, i18nVolumeControl } = this.props;
        const { currentVolumePos, hasVolumeAnimation, isDraggingVolume } = this.state;

        const { volume } = audio || {};
        if (typeof volume === "undefined") {
            return null;
        }

        let indicatorClassNames = "media-controls-volume-bar-scrubber ";

        let volumeClassNames = "media-controls-volume-bar-fill ";

        if (!this.isAudioAvailable()) {
            return (
                <div
                    aria-label={i18nVolumeControl}
                    className="media-controls-volume-container"
                    ref={this.volumeBar}
                    role="progressbar"
                >
                    <div className="media-controls-volume-bar">
                        <div
                            className={indicatorClassNames}
                            style={{ left: currentVolumePos, transitionDuration: hasVolumeAnimation ? ".1s" : "0s" }}
                        />
                        <div className={volumeClassNames} style={{ width: currentVolumePos }} />
                    </div>
                </div>
            );
        }
        else {
            volumeClassNames += "has-media ";
            if (isDraggingVolume) {
                indicatorClassNames += "media-controls-volume-bar-scrubber-dragging";
                volumeClassNames += "media-controls-volume-bar-fill-dragging";
            }
            else {
                indicatorClassNames += "group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250";
                volumeClassNames += "group-hover:bg-green-500 dark:group-hover:bg-green-500";
            }
            return (
                <div
                    aria-label={i18nVolumeControl}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={Number((volume * 100).toFixed(0))}
                    className="media-controls-volume-container group"
                    ref={this.volumeBar}
                    role="progressbar"
                    onContextMenu={this.handleContextMenu}
                    onMouseDown={this.handleVolumeControlMouseOrTouchDown}
                    onTouchStart={this.handleVolumeControlMouseOrTouchDown}
                >
                    <div className="media-controls-volume-bar">
                        <div
                            className={indicatorClassNames}
                            style={{ left: currentVolumePos, transitionDuration: hasVolumeAnimation ? ".1s" : "0s" }}
                        />
                        <div className={volumeClassNames} style={{ width: currentVolumePos }} />
                    </div>
                </div>
            );
        }
    }
}
