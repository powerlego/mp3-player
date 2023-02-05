import React, { ReactNode } from "react";
import { TIME_FORMAT } from "@/constants";
import { getDisplayTimeBySeconds } from "@/utils";

interface DurationProps {
  audio?: HTMLAudioElement | null;
  defaultDuration: ReactNode;
  timeFormat: TIME_FORMAT;
  className?: string;
}

function Duration({ audio, defaultDuration, timeFormat, className }: DurationProps) {
  const [duration, setDuration] = React.useState<ReactNode>(
    audio ? getDisplayTimeBySeconds(audio.duration, audio.duration, timeFormat) : defaultDuration
  );
  const hasAddedAudioEventListener = React.useRef(false);

  const handleAudioDurationChange = React.useCallback(
    (e: Event): void => {
      const audio = e.target as HTMLAudioElement;

      setDuration(getDisplayTimeBySeconds(audio.duration, audio.duration, timeFormat));
    },
    [timeFormat]
  );

  const addAudioEventListeners = React.useCallback((): void => {
    if (audio && !hasAddedAudioEventListener.current) {
      hasAddedAudioEventListener.current = true;
      audio.addEventListener("durationchange", handleAudioDurationChange);
      audio.addEventListener("abort", handleAudioDurationChange);
    }
  }, [audio, handleAudioDurationChange]);

  React.useEffect(() => {
    addAudioEventListeners();
    return () => {
      if (audio && hasAddedAudioEventListener.current) {
        audio.removeEventListener("durationchange", handleAudioDurationChange);
        audio.removeEventListener("abort", handleAudioDurationChange);
      }
    };
  }, [addAudioEventListeners, audio, handleAudioDurationChange]);

  return <div className={className}>{duration}</div>;
}

export default Duration;
