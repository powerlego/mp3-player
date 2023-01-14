import React, { Component } from "react";
import CurrentTime from "../CurrentTime";
import Duration from "../Duration";
import ProgressBar from "../ProgressBar";
import "./TrackProgress.css";

interface TrackProgressProps {
  audio: HTMLAudioElement;
}

class TrackProgress extends Component<TrackProgressProps> {
  progressRef = React.createRef<HTMLDivElement>();
  render() {
    const { audio } = this.props;
    return (
      <div className="media-controls__progress">
        <CurrentTime
          className="media-controls__progress__time"
          audio={audio}
          timeFormat="auto"
          defaultCurrentTime="--:--"
        />
        <ProgressBar ref={this.progressRef} audio={audio} />
        <Duration
          className="media-controls__progress__time"
          audio={audio}
          timeFormat="auto"
          defaultDuration="--:--"
        />
      </div>
    );
  }
}


export default TrackProgress;