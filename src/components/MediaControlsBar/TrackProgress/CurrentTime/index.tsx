import React, { Component, ReactNode } from "react";
import { TIME_FORMAT } from "../../../../constants";
import { getDisplayTimeBySeconds } from "../../../../utils";

interface CurrentTimeProps {
  audio?: HTMLAudioElement | null;
  defaultCurrentTime: ReactNode;
  timeFormat: TIME_FORMAT;
  className?: string;
}

interface CurrentTimeState {
  currentTime: ReactNode;
}

export default class CurrentTime extends Component<
  CurrentTimeProps,
  CurrentTimeState
> {
    audio?: HTMLAudioElement;

    hasAddedAudioEventListener = false;

    constructor(props: CurrentTimeProps) {
        super(props);
        const { audio, defaultCurrentTime, timeFormat } = props;
        let currentTime = defaultCurrentTime;
        if (audio) {
            currentTime = getDisplayTimeBySeconds(
                audio.currentTime,
                audio.duration,
                timeFormat
            );
        }
        this.state = {
            currentTime,
        };
    }

    state: CurrentTimeState = {
        currentTime: this.props.defaultCurrentTime,
    };

    handleAudioCurrentTimeChange = (e: Event): void => {
        const audio = e.target as HTMLAudioElement;
        const { timeFormat, defaultCurrentTime } = this.props;
        this.setState({
            currentTime:
        getDisplayTimeBySeconds(
            audio.currentTime,
            audio.duration,
            timeFormat
        ) || defaultCurrentTime,
        });
    };

    addAudioEventListeners = (): void => {
        const { audio } = this.props;
        if (audio && !this.hasAddedAudioEventListener) {
            this.audio = audio;
            this.hasAddedAudioEventListener = true;
            audio.addEventListener("timeupdate", (e:Event) => {this.handleAudioCurrentTimeChange(e);});
            audio.addEventListener(
                "loadedmetadata",
                (e:Event) => {this.handleAudioCurrentTimeChange(e);}
            );
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
                "timeupdate",
                (e:Event) => {this.handleAudioCurrentTimeChange(e);}
            );
            this.audio.removeEventListener(
                "loadedmetadata",
                (e:Event) => {this.handleAudioCurrentTimeChange(e);}
            );
        }
    }

    render(): React.ReactNode {
        return <div className={this.props.className}>{this.state.currentTime}</div>;
    }
}
