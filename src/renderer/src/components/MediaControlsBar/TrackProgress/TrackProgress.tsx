import { I18nAriaLabels } from "@/types";
import { TIME_FORMAT } from "@renderer/constants";
import React, { ReactNode } from "react";
import CurrentTime from "./CurrentTime";
import Duration from "./Duration";
import ProgressBar from "./ProgressBar";

interface TrackProgressForwardRefProps {
  audio: HTMLAudioElement | null;
  progressUpdateInterval?: number;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  i18nAriaLabels?: I18nAriaLabels;
}

interface TrackProgressProps extends TrackProgressForwardRefProps {
  progressRef: React.RefObject<HTMLDivElement>;
}

function TrackProgress({
  audio,
  progressUpdateInterval,
  timeFormat,
  defaultCurrentTime,
  defaultDuration,
  i18nAriaLabels,
  progressRef,
}: TrackProgressProps) {
  if (!timeFormat) {
    return null;
  }
  return (
    <div className="w-full flex flex-row items-center justify-evenly gap-2">
      <CurrentTime
        audio={audio}
        className="min-w-[2.5rem] text-xs text-gray-800 dark:text-gray-250 text-right"
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
        className="min-w-[2.5rem] text-xs text-gray-800 dark:text-gray-250 text-left"
        defaultDuration={defaultDuration}
        timeFormat={timeFormat}
      />
    </div>
  );
}

function TrackProgressForwardRef(
  props: TrackProgressForwardRefProps,
  ref: React.Ref<HTMLDivElement>
): React.ReactElement {
  return <TrackProgress {...props} progressRef={ref as React.RefObject<HTMLDivElement>} />;
}

export default React.forwardRef(TrackProgressForwardRef);
export { TrackProgress, TrackProgressForwardRef };
