import React, { useState } from "react";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { BiShuffle } from "react-icons/bi";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
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
                <ShuffleButton/>
                <SkipBackButton aria-label={i18nAriaLabels?.previous}/>
                <PlayButton audio={audio} i18nAriaLabels={i18nAriaLabels} togglePlay={togglePlay} />
                <SkipForwardButton aria-label={i18nAriaLabels?.next} />
                <RepeatButton />
            </div>
        );
    }
}


function ShuffleButton() {
    const [isShuffle, setIsShuffle] = useState(false);
    const handleShuffle = () => setIsShuffle(!isShuffle);
    return (
        <div onClick={() => handleShuffle()}>
            {isShuffle
                ? (<BiShuffle className="media-icon shuffle-button shuffling" />)
                : (<BiShuffle className="media-icon shuffle-button" />)}
        </div>
    );
}

function SkipBackButton() {
    return (
        <div onClick={() => console.log("skipBack")}>
            <BsFillSkipStartFill className="media-icon skip-button" />
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
        if (!audio) {return false;}

        return !audio.paused && !audio.ended;
    };
    isAudioAvailable = (): boolean => {
        const { audio } = this.props;
        if (!audio) {return false;}
        if (audio.src === "" || audio.src === window.location.href) {return false;}
        return true;
    };

    addEventListeners = () => {
        const { audio } = this.props;
        if (!audio) {return;}
        audio.addEventListener("play", () => {this.setState({ isPlaying: true });});
        audio.addEventListener("pause", () => {this.setState({ isPlaying: false });});
        audio.addEventListener("ended", () => {this.setState({ isPlaying: false });});
        this.addedEventListeners = true;
    };

    removeEventListeners = () => {
        const { audio } = this.props;
        if (!audio) {return;}
        audio.removeEventListener("play", () => {this.setState({ isPlaying: true });});
        audio.removeEventListener("pause", () => {this.setState({ isPlaying: false });});
        audio.removeEventListener("ended", () => {this.setState({ isPlaying: false });});
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
                <div>
                    <FaPauseCircle className="media-icon play-button" />
                </div>
            );
        }
        else {
            return (
                <div onClick={togglePlay}>
                    {isPlaying
                        ? (
                            <FaPauseCircle
                                aria-label={i18nAriaLabels?.play}
                                className="media-icon play-button has-media"
                            />
                        )
                        : (
                            <FaPlayCircle
                                aria-label={i18nAriaLabels?.pause}
                                className="media-icon play-button has-media"
                            />
                        )}
                </div>
            );
        }
    }
}

function SkipForwardButton() {
    return (
        <div onClick={() => console.log("skipForward")}>
            <BsFillSkipEndFill className="media-icon skip-button" />
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
        <div onClick={() => handleRepeat()}>
            {repeat === 1
                ? (
                    <TbRepeat className="media-icon repeat-button repeating" />
                )
                : repeat === 2
                    ? (
                        <TbRepeatOnce className="media-icon repeat-button repeating" />
                    )
                    : (
                        <TbRepeat className="media-icon repeat-button" />
                    )}
        </div>
    );
}


