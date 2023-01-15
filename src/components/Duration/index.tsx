import React, { Component,ReactNode } from "react";
import { TIME_FORMAT } from "../../constants";
import { getDisplayTimeBySeconds } from "../../utils";

interface DurationProps {
  audio?: HTMLAudioElement;
  defaultDuration: ReactNode;
  timeFormat: TIME_FORMAT;
  className?: string;
}

interface DurationState {
  duration: ReactNode;
}

export default class Duration extends Component<
  DurationProps,
  DurationState
> {
    audio?: HTMLAudioElement;

    hasAddedAudioEventListener = false;

    constructor(props: DurationProps) {
        super(props);
        const { audio, defaultDuration, timeFormat } = props;
        this.state = {
            duration: audio
                ? getDisplayTimeBySeconds(audio.duration, audio.duration, timeFormat)
                : defaultDuration,
        };
    }

    state: DurationState = {
        duration: this.props.audio
            ? getDisplayTimeBySeconds(
                this.props.audio.duration,
                this.props.audio.duration,
                this.props.timeFormat
            )
            : this.props.defaultDuration,
    };

    handleAudioDurationChange = (e: Event): void => {
        const audio = e.target as HTMLAudioElement;
        const { timeFormat, defaultDuration } = this.props;
        this.setState({
            duration:
        getDisplayTimeBySeconds(audio.duration, audio.duration, timeFormat)
        || defaultDuration,
        });
    };

    addAudioEventListeners = (): void => {
        const { audio } = this.props;
        if (audio && !this.hasAddedAudioEventListener) {
            this.audio = audio;
            this.hasAddedAudioEventListener = true;
            audio.addEventListener("durationchange", this.handleAudioDurationChange);
            audio.addEventListener("abort", this.handleAudioDurationChange);
        }
    };

    componentDidMount(): void {
        this.addAudioEventListeners();
    }

    componentDidUpdate(): void {
        this.addAudioEventListeners();
    }

    componentWillUnmount(): void {
        if (this.audio && this.hasAddedAudioEventListener) {
            this.audio.removeEventListener(
                "durationchange",
                this.handleAudioDurationChange
            );
            this.audio.removeEventListener("abort", this.handleAudioDurationChange);
        }
    }

    render() {
        return <div className={this.props.className}>{this.state.duration}</div>;
    }
}
