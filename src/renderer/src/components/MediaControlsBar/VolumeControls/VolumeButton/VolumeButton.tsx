import React from "react";
import { ImVolumeMute2, ImVolumeMute, ImVolumeLow, ImVolumeMedium, ImVolumeHigh } from "react-icons/im";
import { I18nAriaLabels } from "@/types";

type VolumeButtonProps = {
  onClick: () => void;
  audio: HTMLAudioElement | null;
  i18nAriaLabels?: I18nAriaLabels;
};

export default function VolumeButton(props: VolumeButtonProps) {
  const { onClick, audio, i18nAriaLabels } = props;
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(1);
  const hasAddedAudioEventListener = React.useRef(false);
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);

  const toggleMute = React.useCallback((): void => {
    if (!audio) {
      return;
    }
    onClick();
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [audio, isMuted, onClick]);

  const checkMuted = React.useCallback((): void => {
    if (!audio) {
      return;
    }
    if (audio.volume === 0) {
      audio.muted = true;
      setIsMuted(true);
    }
    else {
      audio.muted = false;
      setIsMuted(false);
    }
  }, [audio]);

  const checkVolume = React.useCallback((): void => {
    if (!audio) {
      return;
    }
    setVolume(audio.volume);
  }, [audio]);

  const addEventListenerToAudio = React.useCallback((): void => {
    if (audio && !hasAddedAudioEventListener.current) {
      audio.addEventListener("volumechange", checkMuted);
      audio.addEventListener("volumechange", checkVolume);
      hasAddedAudioEventListener.current = true;
    }
  }, [audio, checkMuted, checkVolume]);

  const removeEventListenerFromAudio = React.useCallback((): void => {
    if (audio && hasAddedAudioEventListener.current) {
      audio.removeEventListener("volumechange", checkMuted);
      audio.removeEventListener("volumechange", checkVolume);
      hasAddedAudioEventListener.current = false;
    }
  }, [audio, checkMuted, checkVolume]);

  React.useEffect(() => {
    addEventListenerToAudio();
    return () => {
      removeEventListenerFromAudio();
    };
  }, [audio, addEventListenerToAudio, removeEventListenerFromAudio]);

  if (!isAudioAvailable) {
    return (
      <div className="aspect-square h-8 flex items-center justify-center  ">
        <ImVolumeMute2 className="fill-gray-350 dark:fill-gray-750 m-0 w-4 h-4" />
      </div>
    );
  }
  else {
    return (
      <div
        aria-label={isMuted ? i18nAriaLabels?.volumeMute : i18nAriaLabels?.volume}
        className="aspect-square h-8 flex items-center justify-center"
        onClick={toggleMute}
      >
        {isMuted
          ? (
            <ImVolumeMute2 className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150" />
          )
          : volume < 0.25
            ? (
              <ImVolumeMute className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150" />
            )
            : volume < 0.5
              ? (
                <ImVolumeLow className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150" />
              )
              : volume < 0.75
                ? (
                  <ImVolumeMedium className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150" />
                )
                : (
                  <ImVolumeHigh className="m-0 w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150" />
                )}
      </div>
    );
  }
}
