import React, { ReactNode } from "react";
import { TIME_FORMAT } from "@renderer/constants";
import { I18nAriaLabels } from "@/types";
import CurrentTime from "./CurrentTime";
import Duration from "./Duration";
import ProgressBar from "./ProgressBar";

interface TrackProgressProps {
  audio: HTMLAudioElement | null;
  progressUpdateInterval?: number;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  i18nAriaLabels?: I18nAriaLabels;
}

function TrackProgress({
  audio,
  progressUpdateInterval,
  timeFormat,
  defaultCurrentTime,
  defaultDuration,
  i18nAriaLabels,
}: TrackProgressProps) {
  const progressRef = React.useRef<HTMLDivElement>(null);
  if (!timeFormat) {
    return null;
  }
  return (
    <div className="w-full flex flex-row items-center justify-evenly gap-2">
      <CurrentTime
        audio={audio}
        className="min-w-[2.5rem] text-xs text-gray-700 dark:text-gray-350 text-right"
        defaultCurrentTime={defaultCurrentTime}
        timeFormat={timeFormat}
      />
      <ProgressBar
        audio={audio}
        i18nProgressBar={i18nAriaLabels?.progressControl}
        progressUpdateInterval={progressUpdateInterval}
        ref={progressRef}
      />
      <Duration
        audio={audio}
        className="min-w-[2.5rem] text-xs text-gray-700 dark:text-gray-350 text-left"
        defaultDuration={defaultDuration}
        timeFormat={timeFormat}
      />
    </div>
  );
}

export default TrackProgress;
