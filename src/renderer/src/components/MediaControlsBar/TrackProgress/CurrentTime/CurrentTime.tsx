import React, { ReactNode } from "react";
import { TIME_FORMAT } from "@renderer/constants";
import getDisplayTimeBySeconds from "@utils/getDisplayTimeBySeconds";

interface CurrentTimeProps {
  audio?: HTMLAudioElement | null;
  defaultCurrentTime: ReactNode;
  timeFormat: TIME_FORMAT;
  className?: string;
}

function CurrentTime({ audio, defaultCurrentTime, timeFormat, className }: CurrentTimeProps) {
  const [currentTime, setCurrentTime] = React.useState<ReactNode>(
    audio ? getDisplayTimeBySeconds(audio.currentTime, audio.duration, timeFormat) : defaultCurrentTime
  );
  const hasAddedAudioEventListener = React.useRef(false);

  const handleAudioCurrentTimeChange = React.useCallback(
    (e: Event): void => {
      const audio = e.target as HTMLAudioElement;
      setCurrentTime(getDisplayTimeBySeconds(audio.currentTime, audio.duration, timeFormat));
    },
    [timeFormat]
  );

  const addAudioEventListeners = React.useCallback((): void => {
    if (audio && !hasAddedAudioEventListener.current) {
      hasAddedAudioEventListener.current = true;
      audio.addEventListener("timeupdate", handleAudioCurrentTimeChange);
      audio.addEventListener("loadedmetadata", handleAudioCurrentTimeChange);
    }
  }, [audio, handleAudioCurrentTimeChange]);

  React.useEffect(() => {
    addAudioEventListeners();
    return () => {
      if (audio && hasAddedAudioEventListener.current) {
        audio.removeEventListener("timeupdate", handleAudioCurrentTimeChange);
        audio.removeEventListener("loadedmetadata", handleAudioCurrentTimeChange);
      }
    };
  }, [addAudioEventListeners, audio, handleAudioCurrentTimeChange]);

  return <div className={className}>{currentTime}</div>;
}

export default CurrentTime;
