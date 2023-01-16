import React, { ReactNode } from "react";
import { AUDIO_PRELOAD_ATTRIBUTE, TIME_FORMAT } from "../../constants";
import "./MediaControlsBar.css";
import TrackProgress from "./TrackProgress";
import MediaControls from "./MediaControls";
import { I18nAriaLabels } from "../../types";

interface MediaControlsBarProps {
    src?: string;
    progressUpdateInterval?: number;

    /**
     * HTML5 Audio tag preload property
     */
    preload?: AUDIO_PRELOAD_ATTRIBUTE;
    i18nAriaLabels?: I18nAriaLabels;
    defaultCurrentTime?: ReactNode;
    defaultDuration?: ReactNode;
    timeFormat?: TIME_FORMAT;
    volume?: number;
}

class MediaControlsBar extends React.Component<MediaControlsBarProps> {
    static defaultProps: MediaControlsBarProps = {
        timeFormat: "auto",
        defaultCurrentTime: "--:--",
        defaultDuration: "--:--",
        i18nAriaLabels: {
            player: "Audio player",
            progressControl: "Audio progress control",
            volumeControl: "Volume control",
            play: "Play",
            pause: "Pause",
            rewind: "Rewind",
            shuffle: "Shuffle",
            shuffleOn: "Shuffle enabled",
            previous: "Previous",
            next: "Skip",
            loop: "Disable loop",
            loopOnce: "Enable loop once",
            loopOff: "Enable loop",
            volume: "Mute",
            volumeMute: "Unmute",
        },
    };

    audio = React.createRef<HTMLAudioElement>();
    togglePlay = (e: React.SyntheticEvent): void => {
        e.stopPropagation();
        const audio = this.audio.current;
        if (!audio) {return;}
        if ((audio.paused || audio.ended) && audio.src) {
            this.playAudioPromise();
        }
        else if (!audio.paused) {
            audio.pause();
        }
    };

    playAudioPromise = (): void => {
        const audio = this.audio.current;
        if (!audio) {return;}
        const playPromise = audio.play();
        // playPromise is null in IE 11

        playPromise.then(null).catch((err) => {
            console.log(err);
        });
    };

    componentDidMount() {
        this.forceUpdate();
    }
    isPlaying = (): boolean => {
        const audio = this.audio.current;
        if (!audio) {return false;}

        return !audio.paused && !audio.ended;
    };

    render() {
        const { src, timeFormat, defaultCurrentTime, defaultDuration, i18nAriaLabels } = this.props;
        const audio = this.audio.current;
        if(!timeFormat) {return null;}
        return (
            <div className="media-container" aria-label={i18nAriaLabels?.player}>
                <audio ref={this.audio} src={src} controls={false} />
                <div className="media-controls">
                    <div className="m-0 flex h-full w-56 bg-gray-200"></div>
                    <div className="media-controls-center">
                        <MediaControls
                            togglePlay={this.togglePlay}
                            audio={audio}
                            i18nAriaLabels={i18nAriaLabels}
                        />
                        <TrackProgress
                            audio={audio}
                            defaultCurrentTime={defaultCurrentTime}
                            defaultDuration={defaultDuration}
                            timeFormat= {timeFormat}
                            i18nAriaLabels={i18nAriaLabels}
                        />
                    </div>
                    <div className="m-0 flex h-full w-56 bg-gray-200">
                        <div className="media-controls-mute" />
                        <div className="media-controls-volume"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MediaControlsBar;
