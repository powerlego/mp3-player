import React from "react";

import { ReactComponent as PlayIcon } from "../../../../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../../../../assets/icons/pause.svg";
import { I18nAriaLabels } from "../../../../types";

interface PlayButtonProps {
  audio?: HTMLAudioElement | null;
  togglePlay?: (e: React.SyntheticEvent) => void;
  i18nAriaLabels?: I18nAriaLabels;
}

// interface PlayButtonState {
//   isPlaying: boolean;
// }

export default function PlayButton({ audio, togglePlay, i18nAriaLabels }: PlayButtonProps): JSX.Element {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const addedEventListeners = React.useRef(false);

  const handlePlayPause = React.useCallback((e: Event) => {
    e.preventDefault();
    if (e.type === "play") {
      console.log("play");
      setIsPlaying(true);
    }
    else if (e.type === "pause") {
      setIsPlaying(false);
    }
    else if (e.type === "ended") {
      setIsPlaying(false);
    }
  }, []);

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
  }, [audio, addedEventListeners, removeEventListeners, addEventListeners]);

  return audio && !(audio.src === "" || audio.src === window.location.href)
    ? (
      <div
        data-testid="play-button"
        className="h-8 aspect-square flex justify-center items-center rounded-full
        cursor-pointer bg-gray-800 dark:bg-gray-150 hover:bg-gray-600 dark:hover:bg-gray-350 transition-all ease-in-out duration-200 hover:scale-[1.1]"
        onClick={togglePlay}
      >
        {isPlaying
          ? (
            <PauseIcon
              aria-label={i18nAriaLabels?.play}
              className="fill-gray-150 dark:fill-gray-800 m-0 w-4 h-4 cursor-pointer"
              data-testid="playing"
              id="pause"
            />
          )
          : (
            <PlayIcon
              aria-label={i18nAriaLabels?.pause}
              className="fill-gray-150 dark:fill-gray-800 m-0 w-4 h-4 cursor-pointer"
              data-testid="playing"
              id="play"
            />
          )}
      </div>
    )
    : (
      <div
        className="h-8 aspect-square flex justify-center items-center bg-gray-450 dark:bg-gray-550 rounded-full cursor-pointer"
        data-testid="play-button"
      >
        <PauseIcon
          className="transition-all duration-300 ease-in-out fill-gray-450 hover:fill-gray-550 dark:fill-gray-550 hover:dark:fill-gray-150 m-0 w-4 h-4 cursor-pointer"
          data-testid="playing"
        />
      </div>
    );
}
