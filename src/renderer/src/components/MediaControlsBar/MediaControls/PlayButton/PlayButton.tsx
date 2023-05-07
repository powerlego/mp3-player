import React from "react";
import { I18nAriaLabels } from "@/types";
import { PlayCircle48Filled, PauseCircle24Filled } from "@fluentui/react-icons";

interface PlayButtonProps {
  audio?: HTMLAudioElement | null;
  togglePlay?: (e: React.SyntheticEvent) => void;
  i18nAriaLabels?: I18nAriaLabels;
}
export default function PlayButton({ audio, togglePlay, i18nAriaLabels }: PlayButtonProps): JSX.Element {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const addedEventListeners = React.useRef(false);
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);

  const handlePlayPause = (e: Event) => {
    e.preventDefault();
    if (e.type === "play") {
      setIsPlaying(true);
    }
    else if (e.type === "pause") {
      setIsPlaying(false);
    }
    else if (e.type === "ended") {
      setIsPlaying(false);
    }
  };

  const addEventListeners = React.useCallback(() => {
    if (!audio) {
      return;
    }
    audio.addEventListener("play", handlePlayPause);
    audio.addEventListener("pause", handlePlayPause);
    audio.addEventListener("ended", handlePlayPause);
    addedEventListeners.current = true;
  }, [audio]);

  const removeEventListeners = React.useCallback(() => {
    if (!audio) {
      return;
    }
    audio.removeEventListener("play", handlePlayPause);
    audio.removeEventListener("pause", handlePlayPause);
    audio.removeEventListener("ended", handlePlayPause);
    addedEventListeners.current = false;
  }, [audio]);

  React.useEffect(() => {
    if (!addedEventListeners.current) {
      addEventListeners();
    }
    return () => {
      removeEventListeners();
    };
  });

  return isAudioAvailable
    ? (
      <div className="h-12 aspect-square flex justify-center items-center " onClick={togglePlay}>
        {isPlaying
          ? (
            <PauseCircle24Filled
              aria-label={i18nAriaLabels?.play}
              className="m-0 w-12 h-12 transition-all ease-in-out duration-200 hover:scale-[1.1] fill-gray-850 dark:fill-gray-150 hover:fill-gray-800 dark:hover:fill-gray-200"
              primaryFill=""
            />
          )
          : (
            <PlayCircle48Filled
              aria-label={i18nAriaLabels?.pause}
              className="m-0 transition-all ease-in-out duration-200 hover:scale-[1.1] fill-gray-850 dark:fill-gray-150 hover:fill-gray-800 dark:hover:fill-gray-200"
              primaryFill=""
            />
          )}
      </div>
    )
    : (
      <div className="h-8 aspect-square flex justify-center items-center bg-gray-350 dark:bg-gray-750 rounded-full ">
        <PauseCircle24Filled className="fill-gray-220 dark:fill-gray-880 m-0 w-12 h-12" primaryFill="" />
      </div>
    );
}
