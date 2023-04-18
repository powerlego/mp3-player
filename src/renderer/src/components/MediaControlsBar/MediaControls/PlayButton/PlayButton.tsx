import React from "react";
import { ReactComponent as PlayIcon } from "@/assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "@/assets/icons/pause.svg";
import { I18nAriaLabels } from "@/types";

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
  }, [audio, handlePlayPause]);

  const removeEventListeners = React.useCallback(() => {
    if (!audio) {
      return;
    }
    audio.removeEventListener("play", handlePlayPause);
    audio.removeEventListener("pause", handlePlayPause);
    audio.removeEventListener("ended", handlePlayPause);
    addedEventListeners.current = false;
  }, [audio, handlePlayPause]);

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
      <div
        className="h-8 aspect-square flex justify-center items-center rounded-full bg-gray-850 dark:bg-gray-150 hover:bg-gray-800 dark:hover:bg-gray-200 transition-all ease-in-out duration-200 hover:scale-[1.1]"
        onClick={togglePlay}
      >
        {isPlaying
          ? (
            <PauseIcon aria-label={i18nAriaLabels?.play} className="fill-gray-220 dark:fill-gray-880 m-0 w-4 h-4 " />
          )
          : (
            <PlayIcon aria-label={i18nAriaLabels?.pause} className="fill-gray-220 dark:fill-gray-880 m-0 w-4 h-4 " />
          )}
      </div>
    )
    : (
      <div className="h-8 aspect-square flex justify-center items-center bg-gray-350 dark:bg-gray-750 rounded-full ">
        <PauseIcon className="fill-gray-220 dark:fill-gray-880 m-0 w-4 h-4" />
      </div>
    );
}
