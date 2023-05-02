import React from "react";
import { SpeakerMute20Filled, Speaker020Filled, Speaker120Filled, Speaker220Filled } from "@fluentui/react-icons";
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
        <SpeakerMute20Filled className="fill-gray-350 dark:fill-gray-750 m-0" primaryFill="" />
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
            <SpeakerMute20Filled
              className="m-0 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
              primaryFill=""
            />
          )
          : volume < 1 / 3
            ? (
              <Speaker020Filled
                className="m-0 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
                primaryFill=""
              />
            )
            : volume < 2 / 3
              ? (
                <Speaker120Filled
                  className="m-0 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
                  primaryFill=""
                />
              )
              : (
                <Speaker220Filled
                  className="m-0 cursor-pointer transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
                  primaryFill=""
                />
              )}
      </div>
    );
  }
}
