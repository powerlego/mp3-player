import React, { Component, ReactNode } from "react";
import { TIME_FORMAT } from "../../../../constants";
import { getDisplayTimeBySeconds } from "../../../../utils";

interface CurrentTimeProps {
  audio?: HTMLAudioElement | null;
  defaultCurrentTime: ReactNode;
  timeFormat: TIME_FORMAT;
  className?: string;
}

function CurrentTime(props: CurrentTimeProps) {
  const { audio, defaultCurrentTime, timeFormat, className } = props;
  const [currentTime, setCurrentTime] = React.useState(
    audio ? getDisplayTimeBySeconds(audio.currentTime, audio.duration, timeFormat) : defaultCurrentTime
  );
  const hasAddedAudioEventListener = React.useRef(false);

  const handleAudioCurrentTimeChange = React.useCallback(
    (e: Event): void => {
      const audio = e.target as HTMLAudioElement;
      setCurrentTime(getDisplayTimeBySeconds(audio.currentTime, audio.duration, timeFormat) || defaultCurrentTime);
    },
    [defaultCurrentTime, timeFormat]
  );

  const addAudioEventListeners = React.useCallback((): void => {
    if (audio && !hasAddedAudioEventListener.current) {
      hasAddedAudioEventListener.current = true;
      audio.addEventListener("timeupdate", (e: Event) => {
        handleAudioCurrentTimeChange(e);
      });
      audio.addEventListener("loadedmetadata", (e: Event) => {
        handleAudioCurrentTimeChange(e);
      });
    }
  }, [audio, handleAudioCurrentTimeChange]);

  React.useEffect(() => {
    addAudioEventListeners();
    return () => {
      if (audio && hasAddedAudioEventListener.current) {
        audio.removeEventListener("timeupdate", (e: Event) => {
          handleAudioCurrentTimeChange(e);
        });
        audio.removeEventListener("loadedmetadata", (e: Event) => {
          handleAudioCurrentTimeChange(e);
        });
      }
    };
  }, [addAudioEventListeners, audio, handleAudioCurrentTimeChange]);

  return (
    <div className={className} data-testid="current-time">
      {currentTime}
    </div>
  );
}

export default CurrentTime;
