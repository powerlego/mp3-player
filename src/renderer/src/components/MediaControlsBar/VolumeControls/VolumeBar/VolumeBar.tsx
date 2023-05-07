import React, { SyntheticEvent } from "react";
import getPosX from "@utils/getPosX";

type VolumeBarProps = {
  audio: HTMLAudioElement | null;
  initVolume: number;
  i18nVolumeControl?: string;
};

type VolumePosInfo = {
  currentVol: number;
  currentVolPos: string;
};

function VolumeBar({ audio, initVolume, i18nVolumeControl }: VolumeBarProps): JSX.Element {
  const volumeBar = React.useRef<HTMLDivElement>(null);
  const lastVolume = React.useRef(initVolume);
  const [currentVolumePos, setCurrentVolumePos] = React.useState(
    `${((lastVolume.current / 1) * 100 || 0).toFixed(2)}%`
  );
  const isDraggingVolume = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(isDraggingVolume.current);
  const hasAddedAudioEventListener = React.useRef(false);
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);

  const getCurrentVolume = (event: TouchEvent | MouseEvent): VolumePosInfo => {
    if (!audio) {
      return {
        currentVol: lastVolume.current,
        currentVolPos: `${((lastVolume.current / 1) * 100 || 0).toFixed(2)}%`,
      };
    }
    if (!volumeBar.current) {
      return {
        currentVol: audio.volume,
        currentVolPos: currentVolumePos,
      };
    }
    const volumeBarRect = volumeBar.current.getBoundingClientRect();
    const maxRelativePos = volumeBarRect.width;
    const relativePos = getPosX(event) - volumeBarRect.left;
    let currentVol;
    let currentVolPos;

    if (relativePos < 0) {
      currentVol = 0;
      currentVolPos = "0%";
    }
    else if (relativePos > volumeBarRect.width) {
      currentVol = 1;
      currentVolPos = "100%";
    }
    else {
      currentVol = relativePos / maxRelativePos;
      currentVolPos = `${(relativePos / maxRelativePos) * 100}%`;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    return { currentVol, currentVolPos };
  };

  const handleContextMenu = (event: SyntheticEvent): void => {
    event.preventDefault();
  };

  const handleWindowMouseOrTouchMove = (event: TouchEvent | MouseEvent): void => {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
    event.stopPropagation();
    if (!audio) {
      return;
    }
    const windowSelection: Selection | null = window.getSelection();
    if (windowSelection && windowSelection.type === "Range") {
      windowSelection.empty();
    }
    if (isDraggingVolume.current) {
      const { currentVol, currentVolPos } = getCurrentVolume(event);
      audio.volume = currentVol;
      setCurrentVolumePos(currentVolPos);
    }
  };

  const handleWindowMouseOrTouchUp = (event: TouchEvent | MouseEvent): void => {
    event.stopPropagation();
    isDraggingVolume.current = false;
    setIsDragging(isDraggingVolume.current);
    if (event instanceof MouseEvent) {
      window.removeEventListener("mousemove", handleWindowMouseOrTouchMove);
      window.removeEventListener("mouseup", handleWindowMouseOrTouchUp);
    }
    else {
      window.removeEventListener("touchmove", handleWindowMouseOrTouchMove);
      window.removeEventListener("touchend", handleWindowMouseOrTouchUp);
    }
  };

  const handleVolumeControlMouseOrTouchDown = (event: React.MouseEvent | React.TouchEvent): void => {
    event.stopPropagation();
    const { currentVol, currentVolPos } = getCurrentVolume(event.nativeEvent);
    if (!audio) {
      return;
    }
    audio.volume = currentVol;
    setCurrentVolumePos(currentVolPos);
    isDraggingVolume.current = true;
    setIsDragging(isDraggingVolume.current);
    if (event.nativeEvent instanceof MouseEvent) {
      window.addEventListener("mousemove", handleWindowMouseOrTouchMove);
      window.addEventListener("mouseup", handleWindowMouseOrTouchUp);
    }
    else {
      window.addEventListener("touchmove", handleWindowMouseOrTouchMove);
      window.addEventListener("touchend", handleWindowMouseOrTouchUp);
    }
  };

  const handleAudioVolumeChange = React.useCallback((): void => {
    (e: Event): void => {
      const { volume } = e.target as HTMLAudioElement;
      lastVolume.current = volume;
      if (isDraggingVolume.current) {
        return;
      }
      setCurrentVolumePos(`${((volume / 1) * 100 || 0).toFixed(2)}%`);
    };
  }, [isDraggingVolume]);

  const handleVolumeChange = React.useCallback((): void => {
    if (!audio) {
      return;
    }
    const { volume } = audio;
    lastVolume.current = volume;
    setCurrentVolumePos(`${((volume / 1) * 100 || 0).toFixed(2)}%`);
  }, [audio]);

  React.useEffect(() => {
    if (audio && !hasAddedAudioEventListener.current) {
      audio.addEventListener("volumechange", handleAudioVolumeChange);
      audio.addEventListener("volumechange", handleVolumeChange);
      hasAddedAudioEventListener.current = true;
    }
    return () => {
      if (audio && hasAddedAudioEventListener.current) {
        audio.removeEventListener("volumechange", handleAudioVolumeChange);
        audio.removeEventListener("volumechange", handleVolumeChange);
        hasAddedAudioEventListener.current = false;
      }
    };
  }, [audio, handleAudioVolumeChange, handleVolumeChange]);

  if (typeof audio?.volume === "undefined") {
    return (
      <div
        aria-label={i18nVolumeControl}
        className="flex h-5 w-full flex-1 flex-row items-center justify-center"
        ref={volumeBar}
        role="progressbar"
      >
        <div className="relative box-border h-1 w-full rounded-full bg-gray-350 dark:bg-gray-750">
          <div className="absolute z-10 box-border h-full rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    );
  }
  return !isAudioAvailable
    ? (
      <div
        aria-label={i18nVolumeControl}
        className="flex h-5 w-full flex-1 flex-row items-center justify-center"
        ref={volumeBar}
        role="progressbar"
      >
        <div className="relative box-border h-1 w-full rounded-full bg-gray-350 dark:bg-gray-750">
          <div className="absolute z-10 box-border h-full rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    )
    : (
      <div
        aria-label={i18nVolumeControl}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Number((audio.volume * 100).toFixed(0))}
        className="flex h-5 w-full flex-1 flex-row items-center justify-center group"
        ref={volumeBar}
        role="progressbar"
        onContextMenu={handleContextMenu}
        onMouseDown={handleVolumeControlMouseOrTouchDown}
        onTouchStart={handleVolumeControlMouseOrTouchDown}
      >
        <div className="relative box-border h-1 w-full rounded-full bg-gray-350 dark:bg-gray-750">
          <div
            style={{ left: currentVolumePos }}
            className={`absolute z-20 box-border rounded-full h-13/4 aspect-square group-hover:scale-100 ${
              isDragging ? "scale-100" : "scale-0"
            }`}
          >
            <div
              className={`absolute h-full w-full top-[calc((50%*-1)+1px)] ml-[calc(50%*-1)] box-border rounded-full shadow shadow-gray-800 dark:shadow-gray-250 group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250 ${
                isDragging ? "bg-gray-550 dark:bg-gray-250" : "bg-gray-450 dark:bg-gray-600"
              }`}
            />
          </div>
          <div
            style={{ width: currentVolumePos }}
            className={`absolute z-10 box-border h-full rounded-full group-hover:bg-green-700 dark:group-hover:bg-green-600 ${
              isDragging ? "bg-green-700 dark:bg-green-600" : "bg-gray-600 dark:bg-gray-250"
            }`}
          />
        </div>
      </div>
    );
}

export default VolumeBar;
