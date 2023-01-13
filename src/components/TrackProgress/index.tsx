import React, { Component } from "react";
import ProgressBar from "../ProgressBar";
import "./TrackProgress.css";

class TrackProgress extends Component {
  progressRef = React.createRef<HTMLDivElement>();
  render() {
    return (
      <div className="media-controls__progress">
        <div className="media-controls__progress__time"> 99:99 </div>
        <ProgressBar ref={this.progressRef} />
        <div className="media-controls__progress__time"> 99:99 </div>
      </div>
    );
  }
}


export default TrackProgress;