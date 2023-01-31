import React from "react";

import { ReactComponent as PlayIcon } from "../../../../assets/icons/play.svg";
import { ReactComponent as PauseIcon } from "../../../../assets/icons/pause.svg";
import { I18nAriaLabels } from "../../../../types";
import "./PlayButton.css";

interface PlayButtonProps {
  audio?: HTMLAudioElement | null;
  togglePlay?: (e: React.SyntheticEvent) => void;
  i18nAriaLabels?: I18nAriaLabels;
}

// interface PlayButtonState {
//   isPlaying: boolean;
// }

export default function PlayButton({ audio, togglePlay, i18nAriaLabels }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const addedEventListeners = React.useRef(false);
  const isAudioAvailable = (): boolean => {
    if (!audio) {
      return false;
    }
    if (audio.src === "" || audio.src === window.location.href) {
      return false;
    }
    return true;
  };

  const addEventListeners = React.useCallback(() => {
    if (!audio) {
      return;
    }
    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });
    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });
    addedEventListeners.current = true;
  }, [audio]);

  const removeEventListeners = React.useCallback(() => {
    if (!audio) {
      return;
    }
    audio.removeEventListener("play", () => {
      setIsPlaying(true);
    });
    audio.removeEventListener("pause", () => {
      setIsPlaying(false);
    });
    audio.removeEventListener("ended", () => {
      setIsPlaying(false);
    });
    addedEventListeners.current = false;
  }, [audio]);

  React.useEffect(() => {
    if (!addedEventListeners.current) {
      addEventListeners();
    }
    return () => {
      removeEventListeners();
    };
  }, [audio, addedEventListeners, removeEventListeners, addEventListeners]);

  return isAudioAvailable()
    ? (
      <div
        className="play-button-container has-media transition-all ease-in-out duration-200 hover:scale-[1.1]"
        onClick={togglePlay}
      >
        {isPlaying
          ? (
            <PauseIcon aria-label={i18nAriaLabels?.play} className="play-button" />
          )
          : (
            <PlayIcon aria-label={i18nAriaLabels?.pause} className="play-button" />
          )}
      </div>
    )
    : (
      <div className="play-button-container">
        <PauseIcon className="media-icon play-button" />
      </div>
    );
}
