import React, { Component } from "react";
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
        <div className="media-controls__progress__time"> 99:99 </div>
        <ProgressBar ref={this.progressRef} audio={audio} />
        <div className="media-controls__progress__time"> 99:99 </div>
      </div>
    );
  }
}


export default TrackProgress;