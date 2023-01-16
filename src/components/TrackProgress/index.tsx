import React, { Component, ReactNode } from "react";
import { TIME_FORMAT } from "../../constants";
import CurrentTime from "../CurrentTime";
import Duration from "../Duration";
import ProgressBar from "../ProgressBar";
import "./TrackProgress.css";

interface TrackProgressProps {
    audio: HTMLAudioElement;
    defaultCurrentTime?: ReactNode;
    defaultDuration?: ReactNode;
    timeFormat?: TIME_FORMAT;
}

class TrackProgress extends Component<TrackProgressProps> {

    progressRef = React.createRef<HTMLDivElement>();
    render() {
        const { audio, timeFormat, defaultCurrentTime, defaultDuration } = this.props;
        if(!timeFormat) {
            return null;
        }
        return (
            <div className="media-controls-progress">
                <CurrentTime
                    className="media-controls-progress-time"
                    audio={audio}
                    timeFormat={timeFormat}
                    defaultCurrentTime={defaultCurrentTime}
                />
                <ProgressBar ref={this.progressRef} audio={audio} />
                <Duration
                    className="media-controls-progress-time"
                    audio={audio}
                    timeFormat={timeFormat}
                    defaultDuration={defaultDuration}
                />
            </div>
        );
    }
}

export default TrackProgress;
