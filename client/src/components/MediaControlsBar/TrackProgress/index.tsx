import React, { Component, ReactNode } from "react";
import { TIME_FORMAT } from "../../../constants";
import CurrentTime from "./CurrentTime";
import Duration from "./Duration";
import ProgressBar from "./ProgressBar";
import "./TrackProgress.css";
import { I18nAriaLabels } from "../../../types";

interface TrackProgressProps {
  audio: HTMLAudioElement | null;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  i18nAriaLabels?: I18nAriaLabels;
}

class TrackProgress extends Component<TrackProgressProps> {
  progressRef = React.createRef<HTMLDivElement>();
  render() {
    const { audio, timeFormat, defaultCurrentTime, defaultDuration, i18nAriaLabels } = this.props;
    if (!timeFormat) {
      return null;
    }
    return (
      <div className="media-controls-progress">
        <CurrentTime
          audio={audio}
          className="media-controls-progress-time"
          defaultCurrentTime={defaultCurrentTime}
          timeFormat={timeFormat}
        />
        <ProgressBar audio={audio} i18nProgressBar={i18nAriaLabels?.progressControl} ref={this.progressRef} />
        <Duration
          audio={audio}
          className="media-controls-progress-time"
          defaultDuration={defaultDuration}
          timeFormat={timeFormat}
        />
      </div>
    );
  }
}

export default TrackProgress;
