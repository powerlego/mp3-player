import React, { ReactNode } from "react";
import { AUDIO_PRELOAD_ATTRIBUTE, TIME_FORMAT } from "../../constants";
import "./MediaControlsBar.css";
import TrackProgress from "./TrackProgress";
import MediaControls from "./MediaControls";
import { I18nAriaLabels } from "../../types";
import VolumeControls from "./VolumeControls";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const jsmediatags = require("jsmediatags");

type MediaControlsBarProps = {
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
    muted?: boolean;
};

type MediaControlsBarState = {
    songName: string;
};

class MediaControlsBar extends React.Component<MediaControlsBarProps, MediaControlsBarState> {
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

    state: MediaControlsBarState = {
        songName: "",
    };

    audio = React.createRef<HTMLAudioElement>();

    lastVolume = this.props.volume ? this.props.volume : 1;

    togglePlay = (e: React.SyntheticEvent): void => {
        e.stopPropagation();
        const audio = this.audio.current;
        if (!audio) {
            return;
        }
        if ((audio.paused || audio.ended) && audio.src) {
            this.playAudioPromise();
        }
        else if (!audio.paused) {
            audio.pause();
        }
    };

    playAudioPromise = (): void => {
        const audio = this.audio.current;
        if (!audio) {
            return;
        }
        const playPromise = audio.play();
        // playPromise is null in IE 11

        playPromise.then(null).catch((err) => {
            console.log(err);
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handlePlay = (e: Event): void => {
        this.forceUpdate();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handlePause = (e: Event): void => {
        if (!this.audio) {
            return;
        }
        this.forceUpdate();
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleEnded = (e: Event): void => {
        if (!this.audio) {
            return;
        }
        // Remove forceUpdate when stop supporting IE 11
        this.forceUpdate();
    };

    handleClickVolumeButton = (): void => {
        const audio = this.audio.current;
        if (!audio) {
            return;
        }
        if (audio.volume > 0) {
            this.lastVolume = audio.volume;
            audio.volume = 0;
        }
        else {
            audio.volume = this.lastVolume;
        }
    };

    handleMuteChange = (): void => {
        this.forceUpdate();
    };

    handleClickLoopButton = (): void => {
        if (!this.audio.current) {
            return;
        }
        this.audio.current.loop = !this.audio.current.loop;
        this.forceUpdate();
    };

    getMetadata = () => {
        const audio = this.audio.current;
        if (!audio) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        jsmediatags.read(audio.src, {
            onSuccess: (tag: any) => {
                console.log(tag);
            },
            onError: (error: any) => {
                console.log(error);
            },
        });
    };

    componentDidMount() {
        this.forceUpdate();
        const audio = this.audio.current;
        if (!audio) {
            return;
        }
        if (this.props.muted) {
            audio.volume = 0;
        }
        else {
            audio.volume = this.lastVolume;
        }
        // mmb.fetchFromUrl(audio.src)
        //     .then((metadata) => {
        //         console.log(metadata);
        //     })
        //     .finally(() => {
        //         this.setState({
        //             songName: "Song Name",
        //         });
        //     });

        // When audio play starts
        audio.addEventListener("play", this.handlePlay);

        audio.addEventListener("ended", this.handleEnded);

        // When the user pauses playback
        audio.addEventListener("pause", this.handlePause);
    }

    componentDidUpdate(prevProps: MediaControlsBarProps): void {
        const { src } = this.props;
        if (prevProps.src !== src) {
            // if (autoPlayAfterSrcChange) {
            //     this.playAudioPromise();
            // }
            // else {
            // Updating pause icon to play icon
            this.forceUpdate();
            // }
        }
    }
    isPlaying = (): boolean => {
        const audio = this.audio.current;
        if (!audio) {
            return false;
        }

        return !audio.paused && !audio.ended;
    };

    render() {
        const { src, timeFormat, defaultCurrentTime, defaultDuration, i18nAriaLabels } = this.props;
        const audio = this.audio.current;
        if (!timeFormat) {
            return null;
        }
        return (
            <div aria-label={i18nAriaLabels?.player} className="media-container">
                <audio controls={false} ref={this.audio} src={src} />
                <button className="h-10 w-10" type="button" onClick={this.getMetadata} />
                <div className="media-controls">
                    <div className="m-0 flex h-full w-56 bg-gray-200" />
                    <div className="media-controls-center">
                        <MediaControls audio={audio} i18nAriaLabels={i18nAriaLabels} togglePlay={this.togglePlay} />
                        <TrackProgress
                            audio={audio}
                            defaultCurrentTime={defaultCurrentTime}
                            defaultDuration={defaultDuration}
                            i18nAriaLabels={i18nAriaLabels}
                            timeFormat={timeFormat}
                        />
                    </div>
                    <VolumeControls
                        audio={audio}
                        i18nAriaLabels={i18nAriaLabels}
                        onClickedVolumeButton={this.handleClickVolumeButton}
                        onMuteChange={this.handleMuteChange}
                    />
                </div>
            </div>
        );
    }
}

export default MediaControlsBar;
